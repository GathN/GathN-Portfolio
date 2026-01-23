import { supabase } from './supabaseClient.js'; 
import { display_Date, image_Url, safe_Comments } from './utils.js'

    async function loadProject() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        const { data, error } = await supabase
            .from('projects')
            .select(`
                *, 
                likes:likes(count),
                comments(username, content, created_at)
            `)
            .eq('id', id)
            .single();
        
            if (error) {
            console.error('Error loading project:', error.message);
            return;
        }
    
        if (!error) {
            const cleanData = data
            cleanData.likes_count = data.likes[0]?.count || 0,
            cleanData.recent_comments = data.comments?.slice(0, 5) || [] 
            renderProjects(cleanData);
        }
    }
    
    function renderProjects(project){

    
    document.title = project.title;
    const container = document.getElementById('project-container');

    let finalImageUrl = image_Url(project.image_url);
    let displayDate = display_Date(project.created_at);

    const optimizedUrl = finalImageUrl;
    const commentsHTML = safe_Comments(project.recent_comments) || []

    container.innerHTML = `
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
                                <svg viewBox="0 0 32 32" style="overflow: visible;" width="4vw" height="4vw" preserveAspectRatio="xMidYMid meet" class="heart">
                                        <path fill="#ff4d4d" d="M16 28.5L14.1 26.8C7.3 20.6 2.8 16.5 2.8 11.5 2.8 7.4 6 4.2 10.1 4.2 12.4 4.2 14.6 5.3 16 7.1 17.4 5.3 19.6 4.2 21.9 4.2 26 4.2 29.2 7.4 29.2 11.5 29.2 16.5 24.7 20.6 17.9 26.8L16 28.5Z" />
                                        
                                        <text 
                                        x="50%" 
                                        y="65%" 
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
    }
  
loadProject();
  //document.addEventListener('DOMContentLoaded', loadProject());
  