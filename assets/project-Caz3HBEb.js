import"./modulepreload-polyfill-B5Qt9EMX.js";import{s as o,i as d,d as c,a as l}from"./interactionlogic-DOi-fYds.js";async function m(){const a=new URLSearchParams(window.location.search).get("id"),{data:e,error:i}=await o.from("projects").select(`
                *, 
                likes:likes(count),
                comments(username, content, created_at)
            `).eq("id",a).single();if(i){console.error("Error loading project:",i.message);return}if(!i){const s=e;s.likes_count=e.likes[0]?.count||0,s.recent_comments=e.comments?.slice(0,5)||[],r(s)}}function r(t){document.title=t.title;const a=document.getElementById("project-container");let e=d(t.image_url),i=c(t.created_at);const s=e,n=l(t.recent_comments)||[];a.innerHTML=`
      <div class="project-card">
                    <img src="${s}" alt="${t.title}">
                <div class="project-content">
                    <div id="title-and-like">
                        <div class="title-and-date">
                            <span id="project-title">${t.title}</span>
                            <br />
                            <span id="display-date">${i}</span>
                        </div>
                        <div class="interactions">
                            <button class="like-btn" data-id="${t.id}">
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
                            ${n||'<p class="no-comments">No comments yet.</p>'}
                        </div>
                    </div>  
                    <div class="comment-input-wrap">
                        <input type="text" placeholder="Say something about this project.." id="input-${t.id}">
                        <button class="send-comment" data-id="${t.id}">Send</button>
                    </div>
                </div>
            </div>
    `}m();
