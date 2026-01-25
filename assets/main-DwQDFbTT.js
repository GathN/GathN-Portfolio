import"./modulepreload-polyfill-B5Qt9EMX.js";import{s as o,i as l,d as r,a as m}from"./interactionlogic-jbzwv6t7.js";async function v(){const{data:s,error:e}=await o.from("projects").select(`
            *, 
            likes:likes(count),
            comments(username, content, created_at)
        `).order("created_at",{referencedTable:"comments",ascending:!1});if(e){console.error("Error loading projects:",e.message);return}if(!e){const t=s.map(i=>({...i,likes_count:i.likes[0]?.count||0,recent_comments:i.comments?.slice(0,3)||[]}));u(t)}}function u(s){const e=document.getElementById("projects-grid");e&&(e.innerHTML="",s.forEach(t=>{let i=l(t.image_url),a=r(t.created_at);const n=i,d=m(t.recent_comments)||[],c=`
            <div class="project-card">
                <div class="project-content">
                    <img src="${n}" alt="${t.title}">
                    <div id="title-and-like">
                        <div class="title-and-date">
                            <span id="project-title">${t.title}</span>
                            <br />
                            <span id="display-date">${a}</span>
                        </div>
                        <div class="interactions">
                            <button class="like-btn" data-id="${t.id}" id="interactable">
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
                                        position="absolute">${t.likes_count||0}</text>

                                </svg>
                            </button>
                        </div>
                    </div>
                    <div>
                            <p class="project-text-box">
                                ${t.slug}
                            </p>
                    </div>
                    <div class="comment-section">
                        <div class="comment-list" id="comments-${t.id}">
                            ${d||'<p class="no-comments">No comments yet.</p>'}
                        </div>
                    </div>  
                    <div class="comment-input-wrap" id="interactable">
                        <input type="text" placeholder="Say something about this project.." id="input-${t.id}">
                        <button class="send-comment" data-id="${t.id}" id="interactable">Send</button>
                        
                    </div>
                    
                <a href="project.html?id=${t.id}" class="project-link"></a>
                </div>
            </div>
        `;e.innerHTML+=c}))}document.addEventListener("DOMContentLoaded",v);
