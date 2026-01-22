
import { supabase } from './supabaseClient.js';

const grid = document.getElementById('portfolio-grid');

const ManageCookie = {
    get(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    },
    set(name, value, days = 365) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()}
        ;path=/;SameSite=Strict`;
    }
};

let visitorId = ManageCookie.get('visitor_id');

if (!visitorId) {
    visitorId = crypto.randomUUID(); 
    ManageCookie.set('visitor_id', visitorId);
}

console.log("Your Anonymous ID:", visitorId);


function updateNameDisplay() {
    const name = localStorage.getItem('portfolio_username') || `Anon_${visitorId.slice(0, 4)}`;
    document.getElementById('username').innerText = name;
}

window.changeName = () => {
    const newName = prompt("Change your display name:", document.getElementById('username').innerText);
    if (newName?.trim()) {
        localStorage.setItem('portfolio_username', newName.trim());
        updateNameDisplay();
    }
};

// Run once on load
updateNameDisplay();



async function fetchAndRefreshComments(projectId) {
    const { data, error } = await supabase
        .from('comments')
        .select('username, content, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .limit(3);

    if (!error) {
        const commentList = document.getElementById(`comments-${projectId}`);
        
        if (commentList) {
            commentList.innerHTML = data.length > 0 
                ? data.map(c => `
                    <div class="single-comment">
                        <strong>${c.username || 'Anon'}:</strong> 
                        <span>${c.content}</span>
                    </div>
                  `).join('')
                : '<p class="no-comments">Be the first to comment!</p>';
        }
    }
}


grid.addEventListener('click', async (e) => {

    const likeBtn = e.target.closest('.like-btn');

    if (e.target.classList.contains('like-btn')) {
        const projectId = likeBtn.getAttribute('data-id');
        const countSpan = likeBtn.querySelector('.like-btn text');
        let currentCount = parseInt(countSpan.textContent) || 0;
        countSpan.textContent = currentCount + 1;

        const { error } = await supabase
            .from('likes')
            .insert([{ 
                project_id: projectId, 
                visitor_id: visitorId
            }]);

        if (error) {
            
            console.error("Like failed:", error);
            countSpan.textContent = currentCount; 
            if (error.code === '23505' ) {
                alert("You've already liked this project");
            }else{
                alert("Could not save like. Please try again.");
            }
        }
    }



    // --- COMMENT LOGIC ---


    if (e.target.classList.contains('send-comment')) {
        const projectId = e.target.getAttribute('data-id');
        const input = document.getElementById(`input-${projectId}`);
        const content = input.value.trim();
        let username = localStorage.getItem('portfolio_username');
        if (!username || username.trim() === "") username = "Anon_" + visitorId.slice(0,4);
        localStorage.setItem('portfolio_username', username);
    

        if (content) {
            const { error } = await supabase
                .from('comments')
                .insert([{ 
                    project_id: projectId, 
                    content: content,
                    visitor_id: visitorId,
                    username: username
                  }]);

            if (!error) {
                input.value = '';
                alert('Comment added!'); 
                fetchAndRefreshComments(projectId);
            }
        }
    }
});


