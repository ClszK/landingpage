(function () {
  const doc = document
  const rootEl = doc.documentElement
  const body = doc.body
  /* global ScrollReveal */
  const sr = window.sr = ScrollReveal({ mobile: false })

  rootEl.classList.remove('no-js')
  rootEl.classList.add('js')

  window.addEventListener('load', function () {
    body.classList.add('is-loaded')
    addBottomCopy();
  })

  const addBottomCopy = () => {

    const view = document.createElement("div");
    view.className = "bottom-copy";
    const copies = [
    "말싸움에 대한",
    "텍스트나 캡쳐화면을 공유해 주시면",
    "빠르게 상황을 파악해서 분석해 드립니다"
    ];
    copies.forEach((c) => {
      const p = document.createElement("p");
      p.className = "bottom-copy-line";
      p.innerText = c;
      view.appendChild(p);
    });
    const container = document.querySelector(".mockup-container");
    container.appendChild(view);
  }

  // Reveal animations
  function revealAnimations () {
    sr.reveal('.feature-extended .device-mockup', {
      duration: 600,
      distance: '100px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'bottom',
      viewFactor: 0.6
    })
    sr.reveal('.feature-extended .feature-extended-body', {
      duration: 600,
      distance: '40px',
      easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      origin: 'top',
      viewFactor: 0.6
    })
  }

  if (body.classList.contains('has-animations')) {
    window.addEventListener('load', revealAnimations)
  }

  // Particle animation
  let Bubble = function (parentNode) {
    let self = this
    self.parentNode = parentNode
    self.getCanvasSize()
    window.addEventListener('resize', function () {
      self.getCanvasSize()
    })
    self.mouseX = 0
    self.mouseY = 0
    window.addEventListener('mousemove', function (e) {
      self.mouseX = e.clientX
      self.mouseY = e.clientY
    })
    self.randomise()
  }

  Bubble.prototype.getCanvasSize = function () {
    let self = this
    self.canvasWidth = self.parentNode.clientWidth
    self.canvasHeight = self.parentNode.clientHeight
  }

  Bubble.prototype.generateDecimalBetween = function (min, max) {
    return (Math.random() * (min - max) + max).toFixed(2)
  }

  Bubble.prototype.update = function () {
    let self = this
    self.translateX = self.translateX - self.movementX
    self.translateY = self.translateY - self.movementY
    self.posX += ((self.mouseX / (self.staticity / self.magnetism)) - self.posX) / self.smoothFactor
    self.posY += ((self.mouseY / (self.staticity / self.magnetism)) - self.posY) / self.smoothFactor

    if (self.translateY + self.posY < 0 || self.translateX + self.posX < 0 || self.translateX + self.posX > self.canvasWidth) {
      self.randomise()
      self.translateY = self.canvasHeight
    }
  }

  Bubble.prototype.randomise = function () {
    let self = this
    self.colors = ['85,107,139', '38,141,247', '66,52,248', '255,108,80', '243, 244, 255', '96, 100, 131']
    self.velocity = 30 // Bubble levitation velocity (the higher the slower)
    self.smoothFactor = 50 // The higher, the smoother
    self.staticity = 30 // Increase value to make bubbles move slower on mousemove
    self.magnetism = 0.1 + Math.random() * 4
    self.color = self.colors[Math.floor(Math.random() * self.colors.length)]
    self.alpha = self.generateDecimalBetween(5, 10) / 10
    self.size = self.generateDecimalBetween(1, 4)
    self.posX = 0
    self.posY = 0
    self.movementX = self.generateDecimalBetween(-2, 2) / self.velocity
    self.movementY = self.generateDecimalBetween(1, 20) / self.velocity
    self.translateX = self.generateDecimalBetween(0, self.canvasWidth)
    self.translateY = self.generateDecimalBetween(0, self.canvasHeight)
  }

  let Background = function (selector) {
    let self = this
    self.canvas = document.getElementById(selector)
    self.ctx = this.canvas.getContext('2d')
    self.dpr = window.devicePixelRatio
  }

  Background.prototype.start = function () {
    let self = this
    self.canvasSize()
    window.addEventListener('resize', function () {
      self.canvasSize()
    })
    self.bubblesList = []
    self.generateBubbles()
    self.animate()
  }

  Background.prototype.canvasSize = function () {
    let self = this
    self.container = self.canvas.parentNode
    // Determine window width and height
    self.w = self.container.offsetWidth
    self.h = self.container.offsetHeight
    self.wdpi = self.w * self.dpr
    self.hdpi = self.h * self.dpr
    // Set canvas width and height
    self.canvas.width = self.wdpi
    self.canvas.height = self.hdpi
    // Set width and height attributes
    self.canvas.style.width = self.w + 'px'
    self.canvas.style.height = self.h + 'px'
    // Scale down canvas
    self.ctx.scale(self.dpr, self.dpr)
  }

  Background.prototype.animate = function () {
    let self = this
    self.ctx.clearRect(0, 0, self.canvas.clientWidth, self.canvas.clientHeight)
    self.bubblesList.forEach(function (bubble) {
      bubble.update()
      self.ctx.translate(bubble.translateX, bubble.translateY)
      self.ctx.beginPath()
      self.ctx.arc(bubble.posX, bubble.posY, bubble.size, 0, 2 * Math.PI)
      self.ctx.fillStyle = 'rgba(' + bubble.color + ',' + bubble.alpha + ')'
      self.ctx.fill()
      self.ctx.setTransform(self.dpr, 0, 0, self.dpr, 0, 0)
    })
    /* global requestAnimationFrame */
    requestAnimationFrame(this.animate.bind(this))
  }

  Background.prototype.addBubble = function (bubble) {
    return this.bubblesList.push(bubble)
  }

  Background.prototype.generateBubbles = function () {
    let self = this
    for (let i = 0; i < self.bubbleDensity(); i++) {
      self.addBubble(new Bubble(self.canvas.parentNode))
    }
  }

  Background.prototype.bubbleDensity = function () {
    return 15
  }

  window.addEventListener('load', function () {
    const heroParticles = new Background('hero-particles')
    const footerParticles = new Background('footer-particles')
    heroParticles.start()
    footerParticles.start()
  })

  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60)
      }
    )
  })()

  let isPhonePresenting = false;

  const chat = [
    {
      isUser: true,
      message: "프사는 왜 내렸어?"
    },
    {
      isUser: true,
      message: "상태명은 또 뭐야.."
    },
    {
      isUser: true,
      message: "헤어진 것처럼.."
    },
    {
      isUser: false,
      message: "없애든 말든 내 맘이지",
    },
    {
      isUser: true,
      message: "그렇게 꼭 싸운 티를 내야 돼?",
    },
    {
      isUser: false,
      message: "내 공간인데 내 맘대로 사용하지도 못함?",
      feedbackMessage: "감정을 표현하는 방식이 다소 공격적이에요. 상대방과의 타협을 찾기가 갈수록 어려워집니다. 상대방에게는 자신의 마음을 고려하지 않고 자기중심적인 태도로 여겨질 수 있어요."
    },
    {
      isUser: false,
      message: "아됐어 그만 얘기해"
    },
    {
      isUser: false,
      message: "나 잘거야"
    }
  ]

  const firstScreen = document.getElementById("first_screen");
  const firstChat = firstScreen.getElementsByClassName("katalk-chat")[0];
  let nextChatIndex = 0;
  let isShowingChat = false;
  const chatInterval = 1500;
  let focusedChat = null;


  window.onscroll = (() => {
    const wasPhonePresenting = isPhonePresenting;
    isPhonePresenting = this.scrollY > 200 && this.scrollY < 1500;
    if (!wasPhonePresenting && isPhonePresenting && !isShowingChat) {
      startShowChat(); 
    }
  })

  let intervalId = null;
  const startShowChat = () => {
    if (nextChatIndex >= chat.length)
      return ;
    isShowingChat = true;
    intervalId = setInterval(() => {
      if (isShowingChat) {
        showChat(chat[nextChatIndex]);
        if (nextChatIndex == chat.length - 1) {
          setTimeout(showRequestButton, 1500);
          stopShowChat();
        }
        nextChatIndex += 1;
      }
    }, chatInterval);
  }

  const stopShowChat = () => {
    isShowingChat = false;
    if (intervalId == null)
      return ;
    clearInterval(intervalId);
    intervalId = null;
  }
  
  const showChat = (chat) => {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    if (chat.isUser)
      bubble.classList.add("userchat");
    else
      bubble.classList.add("otherchat");
    bubble.innerHTML = `<span class="textbox">${chat.message}</span>`;
    chat.bubble = bubble;
    firstChat.appendChild(bubble);
    bubble.scrollIntoView({block: "nearest", inline: "nearest", behavior: "smooth"});
  }

  const showRequestButton = () => {
    const button = document.createElement("div");
    button.className = "request-button-container";
    button.innerHTML = `<button class="request-button">AI로 분석하기</button>`;
    button.addEventListener("click", (e) => showNextScreen());
    firstChat.appendChild(button);
    button.scrollIntoView({block: "nearest", inline: "nearest", behavior: "smooth"});
  }

  const showNextScreen = () => {
    const phone = document.getElementsByClassName("iphonex")[0];
    const button = document.getElementsByClassName("request-button")[0];
    phone.classList.add("elementToScaleDownLeftTop");
    button.classList.add("elementToFadeOut");
    const firstChat = chat[chat.length - 3];
    showFeedbackForChat(firstChat);
  }

  const showFeedbackForChat = (chat) => {
    focusedChat = chat;
    const bubble = chat.bubble;
    bubble.scrollIntoView({block: "nearest", inline: "nearest", behavior: "smooth"});
    bubble.classList.add("focused");
    setTimeout(() => {
      const feedback = createFeedbackView(chat);
      const {y, height} = bubble.getBoundingClientRect(bubble);
      const container = document.getElementsByClassName("mockup-container")[0];
      const id = "currentFocuesd";
      feedback.id = id;
      feedback.style.top = (y + height) +"px";
      container.appendChild(feedback);   
      presentMessage(chat.feedbackMessage, feedback.getElementsByClassName("feedback-content")[0]);
    }, 1000)
  }

  const createFeedbackView = (chat) => {
    const view = document.createElement("div");
    view.className = "feedback";
    const title = document.createElement("span");
    title.className = "feedback-title";
    title.innerText = "AI 분석 결과";
    const chatMessage = document.createElement("p");
    chatMessage.className = "feedback-chat";
    chatMessage.innerText = `${chat.message}`;
    const content = document.createElement("p");
    content.className = "feedback-content";
    view.appendChild(title); 
    view.appendChild(chatMessage);
    view.appendChild(content);
    return view;
  }

  const presentMessage = (message, view) => {
    const str = message.toString();
    const words = str.split(" ");
    let i = 0;

    const timer = () => {

      view.innerText += " " + words[i];
      ++i;
      if (i < words.length) {
        setTimeout(timer, Math.random() * 300);
      }
    }
    setTimeout(timer, 100);
  }
}())
