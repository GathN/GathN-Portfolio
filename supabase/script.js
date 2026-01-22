import { supabase } from './supabaseClient.js'; 

async function fetchProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *, 
            likes:likes(count),
            comments(username, content, created_at)
        `)
        .order('created_at', { referencedTable:'comments', ascending: false });
    
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
                <div class="project-content">
                    <div id="title-and-like">
                        <div class="title-and-date">
                            <span id="project-title">${project.title}</span>
                            <br />
                            <span id="display-date">${displayDate}</span>
                        </div>
                        <div class="interactions">
                            <button class="like-btn" data-id="${project.id}">
                                <svg viewBox="0 0 32 32" style="overflow: visible;" width="3vw" height="3vw" preserveAspectRatio="xMidYMid meet" class="heart">
                                        <path fill="#ff4d4d" d="M16 28.5L14.1 26.8C7.3 20.6 2.8 16.5 2.8 11.5 2.8 7.4 6 4.2 10.1 4.2 12.4 4.2 14.6 5.3 16 7.1 17.4 5.3 19.6 4.2 21.9 4.2 26 4.2 29.2 7.4 29.2 11.5 29.2 16.5 24.7 20.6 17.9 26.8L16 28.5Z" />
                                        
                                        <text 
                                        x="50%" 
                                        y="60%" 
                                        fill="white" 
                                        font-size="1em" 
                                        font-family="Arial" 
                                        text-anchor="middle" 
                                        class="like-count" 
                                        position="absolute">${project.likes_count || 0}</text>

                                </svg>
                            </button>
                        </div>
                    </div>
                        <div>
                            <p class="project-text-box">
                                ${project.slug}
                            </p>
                        </div>
                    <div class="comment-section">
                        <div class="comment-list" id="comments-${project.id}">
                            ${commentsHTML || '<p class="no-comments">No comments yet.</p>'}
                        </div>
                    </div>  
                    <div class="comment-input-wrap">
                        <input type="text" placeholder="Say something about this project.." id="input-${project.id}">
                        <button class="send-comment" data-id="${project.id}">Send</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}
//<a href="project-detail.html?id=${project.id}">View Details</a>
// Start the process when the page loads
document.addEventListener('DOMContentLoaded', fetchProjects);
