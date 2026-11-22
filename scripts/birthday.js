// Birthday page scripts

// ==== Photocard dekorasi ====
// Daftar foto penghias. Tambah / kurangi / ganti file di sini.
// Semua foto di img/cards sudah versi kecil dari folder img.
const photocards = [
  "./img/cards/foto-01.jpeg",
  "./img/cards/foto-02.jpeg",
  "./img/cards/foto-03.jpeg",
  "./img/cards/foto-04.jpeg",
  "./img/cards/foto-05.jpeg",
  "./img/cards/foto-06.jpeg",
  "./img/cards/foto-07.jpeg",
  "./img/cards/foto-08.jpeg",
  "./img/cards/foto-09.jpeg",
  "./img/cards/foto-10.jpeg",
  "./img/cards/foto-11.jpeg",
  "./img/cards/foto-12.jpeg",
  "./img/cards/foto-13.jpeg",
  "./img/cards/foto-14.jpeg",
  "./img/cards/foto-15.jpeg",
  "./img/cards/foto-16.jpeg",
  "./img/cards/foto-17.jpeg",
  "./img/cards/foto-18.jpeg",
  "./img/cards/foto-19.jpeg",
  "./img/cards/foto-20.jpeg",
  "./img/cards/foto-21.jpeg",
  "./img/cards/foto-22.jpeg",
  "./img/cards/foto-23.jpeg",
  "./img/cards/foto-24.jpeg",
  "./img/cards/foto-25.jpeg",
];

// Tampilkan photocard bergantian dari tepi layar (kiri-kanan bergantian).
// Semua foto dipakai, bergiliran terus (loop). Kartu lama keluar saat diganti.
const initPhotocards = () => {
  const wrapper = document.getElementById("photocards");
  if (!wrapper) return;

  const isMobile = window.innerWidth <= 500;

  // Posisi kartu menempel di tepi kiri & kanan, tidak menutupi teks tengah
  // Di HP, cukup 2 kartu di pojok atas supaya teks tengah tetap lega
  const slots = isMobile
    ? [
        { side: "left", top: "1vh", size: "" },
        { side: "right", top: "3vh", size: "" },
      ]
    : [
        { side: "left", top: "6vh", size: "" },
        { side: "right", top: "12vh", size: "size-md" },
        { side: "left", top: "28vh", size: "size-md" },
        { side: "right", top: "34vh", size: "" },
        { side: "left", top: "50vh", size: "size-lg" },
        { side: "right", top: "56vh", size: "size-md" },
        { side: "left", top: "72vh", size: "" },
        { side: "right", top: "78vh", size: "size-md" },
      ];

  const delayPerCard = 1.2; // jeda ganti kartu (detik) - ubah di sini kalau mau lebih cepat/lambat
  const enterDuration = 1.3;
  const exitDuration = 0.7;

  // Rentang acak supaya susunannya berantakan dan agak menjorok ke tengah
  // (dalam px dari tepi layar)
  const insetRange = isMobile ? [8, 34] : [18, 88];
  const rand = (min, max) => min + Math.random() * (max - min);

  // Acak urutan foto, lalu pakai semuanya bergiliran
  const shuffle = (list) => {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  let queue = shuffle(photocards);
  let queueIndex = 0;
  let step = 0;
  const slotCards = new Array(slots.length).fill(null);

  // Ambil foto berikutnya; kalau antrean habis, diacak ulang (loop terus)
  const nextSrc = () => {
    if (queueIndex >= queue.length) {
      queue = shuffle(photocards);
      queueIndex = 0;
    }
    return queue[queueIndex++];
  };

  const showNext = () => {
    const slotIndex = step % slots.length;
    const slot = slots[slotIndex];
    const isLeft = slot.side === "left";
    const oldCard = slotCards[slotIndex];

    // Tiap kemunculan posisi & kemiringannya diacak: lebih berantakan,
    // sekaligus agak menjorok ke tengah layar
    const inset = Math.round(rand(insetRange[0], insetRange[1]));
    const jitter = rand(-2, 2); // geser vertikal acak (vh)
    const baseTop = parseFloat(slot.top);
    const rotation = rand(8, 15) * (Math.random() < 0.5 ? -1 : 1);

    const card = document.createElement("div");
    card.className = `photocard ${slot.size}`.trim();
    card.style.top = `${baseTop + jitter}vh`;
    card.style[isLeft ? "left" : "right"] = `${inset}px`;

    const img = document.createElement("img");
    img.src = nextSrc();
    img.alt = "";
    card.appendChild(img);
    wrapper.appendChild(card);
    slotCards[slotIndex] = card;

    // Kartu lama meluncur keluar ke sisi asalnya
    if (oldCard) {
      gsap.to(oldCard, {
        x: isLeft ? -380 : 380,
        opacity: 0,
        duration: exitDuration,
        ease: "power1.in",
        onComplete: () => oldCard.remove(),
      });
    }

    // Kartu baru masuk dari tepi layar, lalu diam sampai giliran berikutnya
    gsap.fromTo(
      card,
      { x: isLeft ? -380 : 380, opacity: 0, rotation: rotation },
      {
        x: 0,
        opacity: 0.95,
        duration: enterDuration,
        delay: oldCard ? 0.35 : 0,
        ease: "power2.out",
      }
    );

    step++;
  };

  // Jalan terus bergantian sampai halaman ditutup
  const loop = () => {
    showNext();
    gsap.delayedCall(delayPerCard, loop);
  };

  gsap.delayedCall(0.6, loop);
};

// Animation GSAP timeline on load event
window.addEventListener("load", () => {
  Swal.fire({
    title: "Do you want to play music in the background?",
    // text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelector(".song").play();
    }

    // Photocard baru mulai muncul setelah popup ditutup
    initPhotocards();
    animationTimeline();
  });
});

const animationTimeline = () => {
  // split chars that needs  to be animted individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  // Rapikan spasi/newline dari HTML dulu, supaya hasil pecahan per huruf rapi
  textBoxChars.textContent = textBoxChars.textContent.replace(/\s+/g, " ").trim();
  hbd.textContent = hbd.textContent.replace(/\s+/g, " ").trim();

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span>`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span>`;

  // Huruf idea-4 juga dipecah biar bisa muncul satu per satu
  const idea4 = document.getElementsByClassName("idea-4")[0];
  idea4.innerHTML = `<span>${idea4.textContent
    .trim()
    .split("")
    .join("</span><span>")}</span>`;

  // Kursor ketikan di ujung chatbox (kedipnya pakai CSS)
  const cursor = document.createElement("span");
  cursor.className = "type-cursor";
  cursor.textContent = "|";
  textBoxChars.appendChild(cursor);

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewY: "-15deg",
  };

  // Variasi masuk/keluar per ide supaya tidak monoton
  const ideaLeft = { opacity: 0, x: -70, skewX: "8deg" };
  const ideaLeftLeave = { opacity: 0, x: 60, skewX: "-8deg" };
  const ideaRight = { opacity: 0, x: 70, skewX: "-8deg" };
  const ideaRightLeave = { opacity: 0, x: -60, skewX: "8deg" };

  // animation timeline
  const tl = new TimelineMax();

  tl.to(".container", 0.6, {
    visibility: "visible",
  })
    .from(".one", 1.2, {
      opacity: 0,
      y: 40,
      scale: 0.7,
      ease: "elastic.out(1, 0.6)",
    })
    .from("#name", 0.6, {
      scale: 1.4,
      opacity: 0,
      ease: "back.out(3)",
    }, "-=0.7")
    .from(".two", 0.5, {
      opacity: 0,
      y: 15,
      ease: "power2.out",
    }, "-=0.4")
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "+=3.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "-=1"
    )
    .from(".three", 1, {
      opacity: 0,
      scale: 0.3,
      ease: "back.out(2.5)",
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10,
      },
      "+=3"
    )
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0,
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0,
    })
    // kursor muncul tepat sebelum teks diketik, hilang setelah selesai
    .set(".type-cursor", { visibility: "visible", immediateRender: false })
    // ketikan per huruf: fade + naik sedikit biar hidup
    .staggerFromTo(
      ".hbd-chatbox span:not(.type-cursor)",
      0.35,
      { visibility: "visible", opacity: 0, y: 6 },
      { visibility: "visible", opacity: 1, y: 0 },
      0.045
    )
    .set(".type-cursor", { visibility: "hidden", immediateRender: false }, ">")
    .to(
      ".fake-btn",
      0.1,
      {
        backgroundColor: "rgb(127, 206, 248)",
      },
      "+=0.3"
    )
    .to(
      ".fake-btn",
      0.5,
      {
        scale: 1.15,
        repeat: 3,
        yoyo: true,
        ease: "power1.inOut",
      },
      "-=0.1"
    )
    .to(
      ".four",
      0.5,
      {
        scale: 0.2,
        opacity: 0,
        y: -150,
      },
      "+=1"
    )
    .from(".idea-1", 0.7, ideaLeft)
    .to(".idea-1", 0.7, ideaLeftLeave, "+=2.5")
    .from(".idea-2", 0.7, ideaRight)
    .to(".idea-2", 0.7, ideaRightLeave, "+=2.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.1,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=2.5")
    // idea-4 ("Because,") muncul per huruf
    .staggerFrom(
      ".idea-4 span",
      0.5,
      {
        opacity: 0,
        y: -18,
        rotationX: 60,
        ease: "back.out(2)",
      },
      0.06
    )
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=2.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0,
      },
      "+=1.5"
    )
    .to(
      ".idea-5 span",
      0.7,
      {
        rotation: 90,
        x: 8,
      },
      "+=1.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0,
      },
      "+=2"
    )
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut,
      },
      0.2
    )
    // getaran kecil biar kata besarnya berasa "berdebar" sebelum hilang
    .to(
      ".idea-6 span",
      0.3,
      {
        scale: 1.12,
        yoyo: true,
        repeat: 2,
        stagger: 0.08,
        ease: "power1.inOut",
      },
      "-=0.4"
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut,
      },
      0.2,
      "+=0.8"
    )
    .staggerFromTo(
      ".ballons img",
      2.5,
      {
        opacity: 0.9,
        y: 1400,
      },
      {
        opacity: 1,
        y: -1000,
      },
      0.2
    )
    .from(
      ".profile-picture",
      0.5,
      {
        scale: 3.5,
        opacity: 0,
        x: 25,
        y: -25,
        rotationZ: -45,
      },
      "-=2"
    )
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0,
    })
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5),
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150,
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut,
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.9,
      {
        opacity: 0,
        y: 40,
        skewX: "-8deg",
        ease: "power3.out",
      },
      "party"
    )
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4,
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1",
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90,
      },
      "+=1"
    );

  // restart animation on click
  const replyBtn = document.getElementById("replay");
  replyBtn.addEventListener("click", () => {
    tl.restart();
  });
};
