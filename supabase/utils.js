import { supabase } from './supabaseClient.js'; 

export function display_Date(date){
        if (date){
            const dateObj = new Date(date);
            return dateObj.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            });
        } else {
            return "Ongoing/No Date"
        }
}

export function image_Url(img_url){
    if (img_url) {
            const { data } = supabase.storage
                .from('portfolio-images')
                .getPublicUrl(img_url, {
                    transform: { format: 'webp', quality: 80, width: 800 }
                });
            return data.publicUrl;
        } else {
            return 'https://placehold.co/600x400';
        }
}

export function safe_Comments(comments){
    const commentsHTML = comments.length > 0 ?  
        comments.map(c => `
            <div class="single-comment">
                <strong>${c.username}:</strong> 
                <span>${c.content}</span>
            </div>
        `).join(''): `<p class="no-comments">Be the first to comment!</p>`;
    return commentsHTML;
}