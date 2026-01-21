// main.js
import { supabase } from './supabaseClient.js'; // Your client initialization

async function fetchProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *, 
            likes:likes(count),
            comments(username, content, created_at)
        `)
        .order('created_at', { referencedTable:'comments', ascending: false }); // Newest first
    
        if (error) {
        console.error('Error loading projects:', error.message);
        return;
    }

    if (!error) {
        const cleanData = data.map(p => ({
            ...p,
            likes_count: p.likes[0]?.count || 0,
            recent_comments: p.comments?.slice(0, 3) || [] 
        }));
        renderProjects(cleanData);
    }
    //renderProjects(cleanData);
}




function renderProjects(projects) {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = '';

    projects.forEach(project => {
        let finalImageUrl;

        if (project.image_url) {
            const { data } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(project.image_url, {
                    transform: { format: 'webp', quality: 80, width: 800 }
                });
            finalImageUrl = data.publicUrl;
        } else {
            finalImageUrl = 'https://placehold.co/600x400';
        }
        let displayDate = "";
        if (project.created_at){
            const dateObj = new Date(project.created_at);
            displayDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });
        } else {
            displayDate = "Ongoing/No Date"
        }

        const optimizedUrl = finalImageUrl;
        const safeComments = project.recent_comments || [];
        const commentsHTML = safeComments.length > 0 ?  
        safeComments.map(c => `
            <div class="single-comment">
                <strong>${c.username}:</strong> 
                <span>${c.content}</span>
            </div>
        `).join(''): `<p class="no-comments">Be the first to comment!</p>`;

        const cardHTML = `
            <div class="project-card">
                <img src="${optimizedUrl}" alt="${project.title}">
                <h3>${project.title}</h3>
                <p>${displayDate}</p>
                <p>${project.slug}</p>
                <div class="interactions">
                    <button class="like-btn" data-id="${project.id}">
                        ❤️ <span class="like-count">${project.likes_count || 0}</span> 
                    </button>
                </div>
                <a href="project-detail.html?id=${project.id}">View Details</a>
                
                <div class="comment-section">
                    <div class="comment-list" id="comments-${project.id}">
                        ${commentsHTML || '<p class="no-comments">No comments yet.</p>'}
                    </div>
                    <div class="comment-input-wrap">
                        <input type="text" placeholder="Say something about this project.." id="input-${project.id}">
                        <button class="send-comment" data-id="${project.id}">Send</button>
                </div>            
            
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}

// Start the process when the page loads
document.addEventListener('DOMContentLoaded', fetchProjects);
