// Quick test to check what readBy structure looks like
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/news?limit=1', {
    headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => {
    if (data.data && data.data.length > 0) {
        const news = data.data[0];
        console.log('=== NEWS ITEM ===');
        console.log('ID:', news._id);
        console.log('Title:', news.newsTopic);
        console.log('ReadBy array:', JSON.stringify(news.readBy, null, 2));
        console.log('ReadBy length:', news.readBy?.length);
        if (news.readBy && news.readBy.length > 0) {
            console.log('First readBy entry:', JSON.stringify(news.readBy[0], null, 2));
            console.log('First readBy userId type:', typeof news.readBy[0].userId);
            console.log('First readBy userId value:', news.readBy[0].userId);
        }
        
        // Get current user ID
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('\n=== CURRENT USER ===');
        console.log('User ID:', user.id);
        console.log('User ID type:', typeof user.id);
        
        // Test comparison
        if (news.readBy && news.readBy.length > 0) {
            const read = news.readBy[0];
            const readUserId = read.userId?._id || read.userId?.id || read.userId;
            console.log('\n=== COMPARISON ===');
            console.log('ReadUserId (extracted):', readUserId);
            console.log('CurrentUserId:', user.id);
            console.log('String comparison:', String(readUserId) === String(user.id));
            console.log('Direct comparison:', readUserId === user.id);
        }
    }
})
.catch(err => console.error('Error:', err));