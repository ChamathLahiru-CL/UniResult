import Compliance from '../models/Compliance.js';
import User from '../models/User.js';
import fs from 'fs/promises';
import PDFDocument from 'pdfkit';

/**
 * Submit a new compliance
 */
export const submitCompliance = async (req, res) => {
  try {
    const { topic, recipient, importance, message, selectedGroups } = req.body;
    const userId = req.user.id;

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

    // Get student details
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
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
      student: userId,
      studentName: student.name,
      studentEmail: student.email,
      studentIndexNumber: student.indexNumber || student.email,
      topic,
      recipient,
      importance,
      message,
      selectedGroups: groups,
      attachments,
      status: 'pending'
    });

    await compliance.save();

    // TODO: Send notification to recipients
    // This can be implemented using the notification system

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
 * Get all compliances for the logged-in student
 */
export const getMyCompliances = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, importance, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { student: userId };
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

/**
 * Get a single compliance by ID
 */
export const getComplianceById = async (req, res) => {
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

    // Check if user is authorized to view this compliance
    if (compliance.student.toString() !== userId && req.user.role !== 'admin' && req.user.role !== 'examDiv') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this compliance'
      });
    }

    res.status(200).json({
      success: true,
      data: compliance
    });

  } catch (error) {
    console.error('Error fetching compliance:', error);
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
    const { status, importance, recipient, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (importance) query.importance = importance;
    if (recipient) query.recipient = recipient;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const compliances = await Compliance.find(query)
      .populate('student', 'name email indexNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Compliance.countDocuments(query);

    // Get statistics
    const stats = {
      total: await Compliance.countDocuments(),
      pending: await Compliance.countDocuments({ status: 'pending' }),
      inProgress: await Compliance.countDocuments({ status: 'in-progress' }),
      resolved: await Compliance.countDocuments({ status: 'resolved' }),
      high: await Compliance.countDocuments({ importance: 'High', status: { $ne: 'resolved' } }),
      medium: await Compliance.countDocuments({ importance: 'Medium', status: { $ne: 'resolved' } }),
      low: await Compliance.countDocuments({ importance: 'Low', status: { $ne: 'resolved' } })
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
      .populate('student', 'name email indexNumber')
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
      .populate('student', 'name email indexNumber');

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

    // Student Information Section
    doc.fontSize(14).font('Helvetica-Bold').text('Student Information', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Name: ${compliance.studentName}`);
    doc.text(`Index Number: ${compliance.studentIndexNumber}`);
    doc.text(`Email: ${compliance.studentEmail}`);
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
