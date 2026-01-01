import Compliance from '../models/Compliance.js';
import User from '../models/User.js';
import ExamDivisionMember from '../models/ExamDivisionMember.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import fs from 'fs/promises';
import PDFDocument from 'pdfkit';

/**
 * Submit a new compliance
 */
export const submitCompliance = async (req, res) => {
  try {
    const { topic, recipient, importance, message, selectedGroups } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role; // Get role from JWT token

    // Validate required fields
    if (!topic || !recipient || !importance || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate selectedGroups
    const groups = JSON.parse(selectedGroups || '[]');
    if (!groups || groups.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one group'
      });
    }

    // Get user details based on role
    let user;
    let submitterName;
    let submitterEmail;
    let submitterUsername;
    let submitterType;

    if (userRole === 'examDiv') {
      // For exam division members, check ExamDivisionMember collection
      user = await ExamDivisionMember.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Exam Division member not found'
        });
      }
      submitterName = user.nameWithInitial || user.firstName + ' ' + user.lastName;
      submitterEmail = user.email;
      submitterUsername = user.username;
      submitterType = 'exam-division';
    } else {
      // For students/admins, check User collection
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      submitterName = user.name;
      submitterEmail = user.email;
      submitterUsername = user.username;
      submitterType = user.role === 'admin' ? 'admin' : 'student';
    }

    // Process attachments
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        attachments.push({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
          url: `/uploads/compliance/${file.filename}`
        });
      }
    }

    // Create compliance
    const compliance = new Compliance({
      submitter: userId,
      submitterType,
      submitterName: submitterName,
      submitterEmail: submitterEmail,
      submitterIndexNumber: submitterType === 'student' ? (user.indexNumber || user.enrollmentNumber || submitterEmail) : undefined,
      // Legacy fields for backward compatibility
      student: submitterType === 'student' ? userId : undefined,
      studentName: submitterType === 'student' ? submitterName : undefined,
      studentEmail: submitterType === 'student' ? submitterEmail : undefined,
      studentIndexNumber: submitterType === 'student' ? (user.indexNumber || user.enrollmentNumber || submitterEmail) : undefined,
      topic,
      recipient,
      importance,
      message,
      selectedGroups: groups,
      attachments,
      status: 'pending'
    });

    await compliance.save();

    // Send notifications to recipients
    try {
      // For exam division complaints, always send to admin only
      if (submitterType === 'exam-division') {
        await Notification.create({
          type: 'compliance',
          title: `New Exam Division Complaint - ${topic}`,
          message: `${submitterName} submitted a complaint in ${selectedGroups[0] || 'General'} category: ${topic}`,
          priority: importance === 'High' ? 'high' : importance === 'Medium' ? 'medium' : 'low',
          recipients: {
            role: 'admin'
          },
          metadata: {
            complianceId: compliance._id,
            submitterType,
            importance,
            category: selectedGroups[0] || 'General'
          },
          createdBy: {
            userId: userId,
            name: submitterName,
            role: 'examDiv'
          }
        });
      } else {
        // For student complaints, use the original logic
        if (compliance.recipient === 'admin') {
          await Notification.create({
            type: 'compliance',
            title: `New Student Complaint`,
            message: `${submitterName} submitted a complaint: ${topic}`,
            priority: importance === 'High' ? 'high' : importance === 'Medium' ? 'medium' : 'low',
            recipients: {
              role: 'admin'
            },
            metadata: {
              complianceId: compliance._id,
              submitterType,
              importance
            },
            createdBy: {
              userId: userId,
              name: submitterName,
              role: 'student'
            }
          });
        } else if (compliance.recipient === 'students') {
          await Notification.create({
            type: 'compliance',
            title: `New Student Complaint`,
            message: `${submitterName} submitted a complaint: ${topic}`,
            priority: importance === 'High' ? 'high' : importance === 'Medium' ? 'medium' : 'low',
            recipients: {
              role: 'student'
            },
            metadata: {
              complianceId: compliance._id,
              submitterType,
              importance
            },
            createdBy: {
              userId: userId,
              name: submitterName,
              role: 'student'
            }
          });
        } else if (compliance.recipient === 'exam-division') {
          await Notification.create({
            type: 'compliance',
            title: `New Student Complaint`,
            message: `${submitterName} submitted a complaint: ${topic}`,
            priority: importance === 'High' ? 'high' : importance === 'Medium' ? 'medium' : 'low',
            recipients: {
              role: 'examDiv'
            },
            metadata: {
              complianceId: compliance._id,
              submitterType,
              importance
            },
            createdBy: {
              userId: userId,
              name: submitterName,
              role: 'student'
            }
          });
        }
      }
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Don't fail the compliance submission if notifications fail
    }

    // Create activity record for exam division member
    try {
      if (submitterType === 'exam-division') {
        await Activity.create({
          activityType: 'COMPLIANCE_SUBMIT',
          activityName: `Complaint Submitted - ${topic}`,
          description: `Submitted a ${importance.toLowerCase()} priority complaint in ${groups[0] || 'General'} category to ${recipient}`,
          performedBy: userId,
          performedByName: submitterName,
          performedByUsername: submitterUsername,
          performedByEmail: submitterEmail,
          performedByRole: 'examDiv',
          priority: importance === 'High' ? 'HIGH' : importance === 'Medium' ? 'MEDIUM' : 'LOW',
          metadata: {
            complianceId: compliance._id,
            recipient: recipient,
            importance: importance,
            category: groups[0] || 'General',
            topic: topic
          }
        });
      }
    } catch (activityError) {
      console.error('Error creating activity:', activityError);
      // Don't fail the compliance submission if activity creation fails
    }

    res.status(201).json({
      success: true,
      message: 'Compliance submitted successfully',
      data: compliance
    });

  } catch (error) {
    console.error('Error submitting compliance:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting compliance',
      error: error.message
    });
  }
};

/**
 * Get all compliances for the logged-in user (student or exam division)
 */
export const getMyCompliances = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, importance, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { submitter: userId };
    if (status) query.status = status;
    if (importance) query.importance = importance;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const compliances = await Compliance.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Compliance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: compliances,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching compliances:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching compliances',
      error: error.message
    });
  }
};

export const getComplianceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log(`🔍 Fetching compliance with ID: ${id} for user: ${userId} (role: ${req.user.role})`);

    const compliance = await Compliance.findById(id);

    if (!compliance) {
      console.log(`❌ Compliance not found: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Compliance not found'
      });
    }

    console.log(`✅ Found compliance: ${compliance._id}, submitter: ${compliance.submitter}, submitterType: ${compliance.submitterType}`);

    // Check if user is authorized to view this compliance
    // For students: only their own complaints
    // For admins/examDiv: all complaints
    const isOwner = compliance.submitter && compliance.submitter.toString() === userId;
    const isAdminOrExamDiv = req.user.role === 'admin' || req.user.role === 'examDiv';
    
    console.log(`🔐 Authorization check - isOwner: ${isOwner}, isAdminOrExamDiv: ${isAdminOrExamDiv}`);

    if (!isOwner && !isAdminOrExamDiv) {
      console.log(`❌ Authorization failed for user ${userId}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this compliance'
      });
    }

    console.log(`✅ Authorization successful, returning compliance data`);

    res.status(200).json({
      success: true,
      data: compliance
    });

  } catch (error) {
    console.error('❌ Error fetching compliance:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching compliance',
      error: error.message
    });
  }
};

/**
 * Get all compliances (Admin/Exam Division only)
 */
export const getAllCompliances = async (req, res) => {
  try {
    const { status, importance, recipient, submitterType, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (importance) query.importance = importance;
    if (recipient) query.recipient = recipient;
    
    // Filter by submitter type (student or exam-division)
    if (submitterType) {
      query.submitterType = submitterType;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { submitterName: { $regex: search, $options: 'i' } },
        { submitterEmail: { $regex: search, $options: 'i' } },
        { submitterIndexNumber: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentEmail: { $regex: search, $options: 'i' } },
        { studentIndexNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const compliances = await Compliance.find(query)
      .populate('submitter', 'name email indexNumber enrollmentNumber role')
      .populate('student', 'name email indexNumber enrollmentNumber') // For backward compatibility
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Compliance.countDocuments(query);

    // Get comprehensive statistics
    const stats = {
      total: await Compliance.countDocuments({ submitterType: { $in: ['student', 'exam-division'] } }),
      pending: await Compliance.countDocuments({ status: 'pending', submitterType: { $in: ['student', 'exam-division'] } }),
      inProgress: await Compliance.countDocuments({ status: 'in-progress', submitterType: { $in: ['student', 'exam-division'] } }),
      resolved: await Compliance.countDocuments({ status: 'resolved', submitterType: { $in: ['student', 'exam-division'] } }),
      closed: await Compliance.countDocuments({ status: 'closed', submitterType: { $in: ['student', 'exam-division'] } }),
      high: await Compliance.countDocuments({ importance: 'High', status: { $ne: 'resolved' }, submitterType: { $in: ['student', 'exam-division'] } }),
      medium: await Compliance.countDocuments({ importance: 'Medium', status: { $ne: 'resolved' }, submitterType: { $in: ['student', 'exam-division'] } }),
      low: await Compliance.countDocuments({ importance: 'Low', status: { $ne: 'resolved' }, submitterType: { $in: ['student', 'exam-division'] } }),
      // Submitter type stats
      studentComplaints: await Compliance.countDocuments({ submitterType: 'student' }),
      examDivisionComplaints: await Compliance.countDocuments({ submitterType: 'exam-division' }),
      // Unread stats
      unread: await Compliance.countDocuments({ isRead: false, submitterType: { $in: ['student', 'exam-division'] } }),
      studentUnread: await Compliance.countDocuments({ submitterType: 'student', isRead: false }),
      examDivUnread: await Compliance.countDocuments({ submitterType: 'exam-division', isRead: false })
    };

    res.status(200).json({
      success: true,
      data: compliances,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching all compliances:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching compliances',
      error: error.message
    });
  }
};

/**
 * Update compliance status (Admin/Exam Division only)
 */
export const updateComplianceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseMessage } = req.body;

    const compliance = await Compliance.findById(id);

    if (!compliance) {
      return res.status(404).json({
        success: false,
        message: 'Compliance not found'
      });
    }

    compliance.status = status || compliance.status;

    if (responseMessage) {
      compliance.response = {
        message: responseMessage,
        respondedBy: req.user.id,
        respondedByName: req.user.name,
        respondedAt: new Date()
      };
    }

    await compliance.save();

    res.status(200).json({
      success: true,
      message: 'Compliance updated successfully',
      data: compliance
    });

  } catch (error) {
    console.error('Error updating compliance:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating compliance',
      error: error.message
    });
  }
};

/**
 * Delete a compliance (Admin only)
 */
export const deleteCompliance = async (req, res) => {
  try {
    const { id } = req.params;

    const compliance = await Compliance.findById(id);

    if (!compliance) {
      return res.status(404).json({
        success: false,
        message: 'Compliance not found'
      });
    }

    // Delete associated files
    if (compliance.attachments && compliance.attachments.length > 0) {
      for (const attachment of compliance.attachments) {
        try {
          await fs.unlink(attachment.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }
    }

    await Compliance.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Compliance deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting compliance:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting compliance',
      error: error.message
    });
  }
};

/**
 * Download compliance attachment
 */
export const downloadAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const compliance = await Compliance.findById(id);

    if (!compliance) {
      return res.status(404).json({
        success: false,
        message: 'Compliance not found'
      });
    }

    const attachment = compliance.attachments.find(
      att => att._id.toString() === attachmentId
    );

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    // Check file exists
    try {
      await fs.access(attachment.path);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.download(attachment.path, attachment.originalName);

  } catch (error) {
    console.error('Error downloading attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading attachment',
      error: error.message
    });
  }
};

/**
 * Get compliances for Exam Division
 */
export const getExamDivisionCompliances = async (req, res) => {
  try {
    const { status, importance, page = 1, limit = 10, search } = req.query;

    // Build query for exam division recipient
    // Match multiple possible values for exam division
    const query = {
      $or: [
        { recipient: 'Exam Division' },
        { recipient: 'exam-division' },
        { recipient: { $regex: 'exam', $options: 'i' } },
        { selectedGroups: 'Exam Division' },
        { selectedGroups: 'Exam Officers' },
        { selectedGroups: { $regex: 'exam', $options: 'i' } }
      ]
    };

    if (status) query.status = status;
    if (importance) query.importance = importance;
    
    // Add search functionality
    if (search) {
      query.$and = [{
        $or: [
          { studentName: { $regex: search, $options: 'i' } },
          { studentIndexNumber: { $regex: search, $options: 'i' } },
          { topic: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ]
      }];
    }

    console.log('📋 Exam Division Query:', JSON.stringify(query, null, 2));

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const compliances = await Compliance.find(query)
      .populate('submitter', 'name email indexNumber role')
      .populate('student', 'name email indexNumber') // For backward compatibility
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Compliance.countDocuments(query);

    // Get statistics for exam division - use same query pattern
    const examDivisionQuery = {
      $or: [
        { recipient: 'Exam Division' },
        { recipient: 'exam-division' },
        { recipient: { $regex: 'exam', $options: 'i' } },
        { selectedGroups: 'Exam Division' },
        { selectedGroups: 'Exam Officers' },
        { selectedGroups: { $regex: 'exam', $options: 'i' } }
      ]
    };

    const stats = {
      total: await Compliance.countDocuments(examDivisionQuery),
      pending: await Compliance.countDocuments({ ...examDivisionQuery, status: 'pending' }),
      inProgress: await Compliance.countDocuments({ ...examDivisionQuery, status: 'in-progress' }),
      resolved: await Compliance.countDocuments({ ...examDivisionQuery, status: 'resolved' }),
      closed: await Compliance.countDocuments({ ...examDivisionQuery, status: 'closed' }),
      unread: await Compliance.countDocuments({ ...examDivisionQuery, isRead: false }),
      high: await Compliance.countDocuments({ ...examDivisionQuery, importance: 'High', status: { $ne: 'resolved' } }),
      medium: await Compliance.countDocuments({ ...examDivisionQuery, importance: 'Medium', status: { $ne: 'resolved' } }),
      low: await Compliance.countDocuments({ ...examDivisionQuery, importance: 'Low', status: { $ne: 'resolved' } })
    };

    console.log('📊 Exam Division Stats:', stats);
    console.log('📝 Found compliances:', compliances.length);

    res.status(200).json({
      success: true,
      data: compliances,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching exam division compliances:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching compliances',
      error: error.message
    });
  }
};

/**
 * Mark compliance as read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const compliance = await Compliance.findById(id);

    if (!compliance) {
      return res.status(404).json({
        success: false,
        message: 'Compliance not found'
      });
    }

    // Mark as read and add user to readBy array if not already present
    if (!compliance.readBy.includes(userId)) {
      compliance.readBy.push(userId);
      compliance.isRead = true;
      await compliance.save();
    }

    res.status(200).json({
      success: true,
      message: 'Compliance marked as read',
      data: compliance
    });

  } catch (error) {
    console.error('Error marking compliance as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking compliance as read',
      error: error.message
    });
  }
};

/**
 * Download compliance as PDF document
 */
export const downloadCompliancePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const compliance = await Compliance.findById(id)
      .populate('submitter', 'name email indexNumber role nameWithInitial firstName lastName username position')
      .populate('student', 'name email indexNumber'); // For backward compatibility

    if (!compliance) {
      return res.status(404).json({
        success: false,
        message: 'Compliance not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=compliance-${compliance._id}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add header
    doc.fontSize(20).font('Helvetica-Bold').text('COMPLIANCE REPORT', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(`Reference ID: ${compliance._id}`, { align: 'center' });
    doc.moveDown(2);

    // Add horizontal line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Submitter Information Section - Different for students vs exam division
    if (compliance.submitterType === 'exam-division') {
      // Exam Division Member Information
      doc.fontSize(14).font('Helvetica-Bold').text('Exam Division Member Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Name: ${compliance.submitterName || (compliance.submitter ? compliance.submitter.nameWithInitial || `${compliance.submitter.firstName} ${compliance.submitter.lastName}` : 'N/A')}`);
      doc.text(`Member ID: ${compliance.submitter ? compliance.submitter.username : compliance.submitterIndexNumber || 'N/A'}`);
      doc.text(`Email: ${compliance.submitterEmail || (compliance.submitter ? compliance.submitter.email : 'N/A')}`);
      doc.text(`Position: ${compliance.submitter ? compliance.submitter.position : 'N/A'}`);
    } else {
      // Student Information
      doc.fontSize(14).font('Helvetica-Bold').text('Student Information', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Name: ${compliance.submitterName || compliance.studentName || (compliance.submitter ? compliance.submitter.name : 'N/A')}`);
      doc.text(`Index Number: ${compliance.submitterIndexNumber || compliance.studentIndexNumber || (compliance.submitter ? compliance.submitter.indexNumber : 'N/A')}`);
      doc.text(`Email: ${compliance.submitterEmail || compliance.studentEmail || (compliance.submitter ? compliance.submitter.email : 'N/A')}`);
    }
    doc.moveDown(1.5);

    // Compliance Details Section
    doc.fontSize(14).font('Helvetica-Bold').text('Compliance Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Topic: ${compliance.topic}`);
    doc.text(`Recipient: ${compliance.recipient}`);
    doc.text(`Importance: ${compliance.importance}`);
    doc.text(`Status: ${compliance.status.charAt(0).toUpperCase() + compliance.status.slice(1)}`);
    doc.text(`Submitted Date: ${new Date(compliance.createdAt).toLocaleString()}`);
    
    if (compliance.selectedGroups && compliance.selectedGroups.length > 0) {
      doc.text(`Selected Groups: ${compliance.selectedGroups.join(', ')}`);
    }
    doc.moveDown(1.5);

    // Message Section
    doc.fontSize(14).font('Helvetica-Bold').text('Message', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(compliance.message, {
      align: 'justify',
      width: 500
    });
    doc.moveDown(1.5);

    // Attachments Section
    if (compliance.attachments && compliance.attachments.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Attachments', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      compliance.attachments.forEach((attachment, index) => {
        doc.text(`${index + 1}. ${attachment.originalName} (${(attachment.size / 1024).toFixed(2)} KB)`);
      });
      doc.moveDown(1.5);
    }

    // Response Section
    if (compliance.response && compliance.response.message) {
      doc.fontSize(14).font('Helvetica-Bold').text('Admin Response', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Responded By: ${compliance.response.respondedByName}`);
      doc.text(`Response Date: ${new Date(compliance.response.respondedAt).toLocaleString()}`);
      doc.moveDown(0.5);
      doc.text('Response Message:', { font: 'Helvetica-Bold' });
      doc.font('Helvetica').text(compliance.response.message, {
        align: 'justify',
        width: 500
      });
      doc.moveDown(1.5);
    }

    // Read Status Section
    doc.fontSize(14).font('Helvetica-Bold').text('Read Status', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Is Read: ${compliance.isRead ? 'Yes' : 'No'}`);
    if (compliance.readBy && compliance.readBy.length > 0) {
      doc.text(`Read By: ${compliance.readBy.length} user(s)`);
    }
    doc.moveDown(2);

    // Footer
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica').text(
      'This is a system-generated document from UniResult Exam Management System',
      { align: 'center', color: 'gray' }
    );
    doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center', color: 'gray' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
};
