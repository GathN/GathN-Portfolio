import gsap from "gsap";

const enterBtn = document.querySelector('.ball');
const splash = document.querySelector('.container');

enterBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stop immediate jump to main.html
    const destination = "main.html";

    // Create a GSAP Timeline for the transition
    const tl = gsap.timeline({
        onComplete: () => {
            window.location.href = destination; // Redirect when done
        }
    });

    tl.to(enterBtn, {
        scale: 1.5,          // Grow the button
        duration: 0.4,
        ease: "power2.out"
    })
     .to(splash, {
         opacity: 0,          // Fade out the entire splash section
        duration: 0.6,
        ease: "power1.inOut"
    }, "-=0.2");             // Start fade slightly before grow ends
});





const element = document.querySelector(".ball");
const b1 = "linear-gradient(217deg, rgba(158, 66, 66, 0.9), rgba(255,0,0,0) 70.71%),  linear-gradient(127deg, rgba(82, 163, 82, 0.61), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(105, 105, 153, 0.9), rgba(69, 69, 211, 0.34) 70.71%)";
const b2 = "linear-gradient(var(--base-deg, 17deg), rgba(255,0,0,0.7), rgba(255,0,0,0) 70.71%), linear-gradient(calc(var(--base-deg, 17deg) + 183deg), rgba(226, 46, 91, 0.9), rgba(243, 197, 137, 0.86) 70.71%),  linear-gradient(calc(var(--base-deg, 17deg) + 319deg), rgba(223, 161, 110, 0.8), rgba(125, 125, 241, 0.1) 70.71%)";//, #000000";
//const b2 = "linear-gradient(var(--base-deg, 17deg), rgba(255,0,0,1), rgba(255,0,0,1) 70.71%), linear-gradient(calc(var(--base-deg, 17deg) + 183deg), rgba(226, 46, 91, 1), rgba(243, 197, 137, 1) 70.71%),  linear-gradient(calc(var(--base-deg, 17deg) + 319deg), rgba(223, 161, 110, 1), rgba(125, 125, 241, 1) 70.71%), #000000";

const mm = gsap.matchMedia();

mm.add({
  isDesktop: "(min-width: 1024px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isMobile: "(max-width: 767px)",
  
}, (context) => {
    let {isDesktop, isTablet, isMobile} = context.conditions;


if(isDesktop){
console.log("I'm on desktop!")
const bl = gsap.timeline();
const hover = gsap.timeline({ paused: true, overwrite: "auto" });

//hover enlarge
hover.to(element, {
  scale: 2.5,
  duration: 0.4,
  ease: "power2.out",
}).to(".shadow2", {
    scale:2.5,
    yPercent: 20,
    autoAlpha: 1,
    ease: "power2.out"
}, "<");

bl.set(".ball", 
    {
        top: "20%",     
        left: "50%",
        color: "#ffffff00",
        background:b1,
    }
).to(".ball", 
    {
        duration: 2,
        top: "70%",
        yPercent: -50,
        //y: "20vw",
        ease: "bounce.out",
    }, 0
).to(".ball", {
    scale:2,
    color: "#FFFFFF",
    backgroundImage:b2,
    backgroundColor: "#000000", 
    onComplete: () => {
        element.addEventListener("mouseenter", () => {
            hover.play()
        });
        element.addEventListener("mouseleave", () => {
            hover.reverse()
        });
    }
});
bl.to(".ball",{
    duration: 2,
    x:"-30vw",
}, 0)
bl.to(".shadow2", {
    top: "20%",     
    left: "50%",
}, 0).to(".shadow2", {
    x:"-30vw", 
    duration: 2,
    top: "70%",
    yPercent: -70,
    
}, 0)

//setting rotation to mouse movement
element.addEventListener("mousemove", (e) => {
  const rect = element.getBoundingClientRect();
  const deg = Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)) * 180 / Math.PI + 90;

  gsap.set(element, { "--base-deg": `${deg}deg` });
});

bl.set(".shadow",
    {
        top: "70%",     
        left: "50%",
},0
).to(".shadow",
    {
        duration: 2,
        x:"-30vw",
}, 0).to(".shadow", { 
  scale: 1.4,       
  opacity: 0.2,    
  duration: 0.6, 
  ease: "bounce.out" 
}, "<")


bl.set(".brush_stroke", {
    top: "70%",     
    left: "50%",
    scale: 0,
}, 0).to(".brush_stroke", {
    duration: 1,
    x:"-28vw",
    // y:"5vw",
    scale: 1,
}, 0).to(".brush_stroke", {
    autoAlpha: 1,
    duration: 2,
})
    return () => window.removeEventListener("mousemove", onMouseMove);
}
else if (isMobile || isTablet) {
    console.log("I'm on mobile!")
    const bl = gsap.timeline();
    bl.set(".ball", 
    {
        top: "20%",     
        left: "100%",
        color: "#ffffff00",
        background:b1,
    }
    ).to(".ball", 
    {
        duration: 2,
        top: "50%",
        yPercent: -50,
        ease: "bounce.out",
    }, 0
    ).to(".ball",{
        duration: 2,
        x:"-50vw",
        xPercent: -50,
    }, 0
    ).to(".ball", {
        scale:2,
        color: "#FFFFFF",
        backgroundImage:b2,
        backgroundColor: "#000000"
    }).set("ball", {
        left: "50%",
        top: "50%",
        xPercent: -50,
        // yPercent: isMobile? -150 : -240,

    });

    bl.to(".shadow2", {
        top: "20%",     
        left: "100%",
    }, 0).to(".shadow2", {
        x:"-50vw",
        xPercent: -50, 
        duration: 2,
        top: "50%",
        scale:2,
    }, 0).to(".shadow2", {
        yPercent: -30,
        autoAlpha: 1,
        ease: "power2.out"
    })


    bl.set(".shadow",
    {
        top: "50%",     
        left: "100%",
    },0
    ).to(".shadow",
    {
        duration: 2,
        x:"-50vw",
        xPercent: -50,
    }, 0).to(".shadow", { 
        scale: 1.4,       
        opacity: 0.2,    
        duration: 0.6, 
        ease: "bounce.out" 
    }, "<")

    bl.set(".brush_stroke", {
        top: "50%",     
        left: "100%",
        scale: 0,
    }, 0).to(".brush_stroke", {
        duration: 1,
        x:"-50vw",
        // y:"5vw",
        scale: 1,
    }, 0).to(".brush_stroke", {
        autoAlpha: 1,
        duration: 2,
    })


}




});

//via @jack
//gsap.fromTo("#a", {width:300, height:200, background: b1}, {ease: "none", duration: 6, background: b2, repeat: -1, yoyo: true});