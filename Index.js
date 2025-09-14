const { default: makeWASocket, useMultiFileAuthState, downloadMediaMessage } = require("@whiskeysockets/baileys");
const chalk = require("chalk");
const fetch = require("node-fetch");
const moment = require("moment");
moment.locale("fr");

// Variables
const OWNER_NUMBER = process.env.OWNER_NUMBER || "243 860 543 294";

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "open") console.log(chalk.green("✅ DEKU-MD connecté !"));
    else if (connection === "close") {
      console.log(chalk.red("❌ Connexion fermée, reconnexion..."));
      startBot();
    }
  });

  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const text = (m.message.conversation || m.message.extendedTextMessage?.text || "").trim().toLowerCase();

    // ===== COMMANDES =====
    switch(text) {

      // ----------------- UTILITAIRES -----------------
      case "menu":
        await sock.sendMessage(from, { text: `
✨ DEKU-MD BOT ✨
🛠️ Commandes Utilitaires:
menu, ping, heure, info, owner, calc, convert, weather, time, qr

🎉 Divertissement:
blague, quote, animequote, dice, coin, fortune, compliment, insulte, motdujour, joke

📸 Médias:
sticker, gif, tts, yt, tiktok, ig, lyrics, meme, photo, avatar

🎮 Jeux:
rps, quiz, trivia, hangman, memory, numbergame, tic-tac-toe, coinflipgame, rockgame, slot

📚 Divers:
fact, advice, horoscope, news, covid, stock, remind, alarm, todo, poll
        `});
        break;

      case "ping":
        await sock.sendMessage(from, { text: "🏓 Pong! Le bot est actif." });
        break;

      case "heure":
        await sock.sendMessage(from, { text: `🕒 Heure actuelle : ${moment().format("LLLL")}` });
        break;

      case "info":
        await sock.sendMessage(from, { text: "🤖 DEKU-MD BOT\nVersion: 1.0.0\nHébergé sur Replit" });
        break;

      case "owner":
        await sock.sendMessage(from, { text: `👑 Owner: ${OWNER_NUMBER}` });
        break;

      case "calc":
        await sock.sendMessage(from, { text: "Exemple: calc 2+2 (fonctionnalité à coder)" });
        break;

      case "convert":
        await sock.sendMessage(from, { text: "Exemple: convert 10 USD to EUR (fonctionnalité à coder)" });
        break;

      case "weather":
        await sock.sendMessage(from, { text: "Exemple: weather Paris (fonctionnalité à coder)" });
        break;

      case "time":
        await sock.sendMessage(from, { text: "Exemple: time Tokyo (fonctionnalité à coder)" });
        break;

      case "qr":
        await sock.sendMessage(from, { text: "QR code à générer depuis le texte (fonctionnalité à coder)" });
        break;

      // ----------------- FUN / DIVERTISSEMENT -----------------
      case "blague":
        try {
          const res = await fetch("https://v2.jokeapi.dev/joke/Any?lang=fr");
          const data = await res.json();
          const joke = data.type === "single" ? data.joke : `${data.setup}\n${data.delivery}`;
          await sock.sendMessage(from, { text: joke });
        } catch { await sock.sendMessage(from, { text: "Impossible de récupérer la blague." }); }
        break;

      case "quote":
        try {
          const res = await fetch("https://type.fit/api/quotes");
          const data = await res.json();
          const q = data[Math.floor(Math.random()*data.length)];
          await sock.sendMessage(from, { text: `"${q.text}"\n- ${q.author || "Inconnu"}` });
        } catch { await sock.sendMessage(from, { text: "Impossible de récupérer la citation." }); }
        break;

      case "animequote":
        try {
          const res = await fetch("https://animechan.vercel.app/api/random");
          const data = await res.json();
          await sock.sendMessage(from, { text: `"${data.quote}"\n- ${data.character}, ${data.anime}` });
        } catch { await sock.sendMessage(from, { text: "Impossible de récupérer la citation anime." }); }
        break;

      case "dice":
        await sock.sendMessage(from, { text: `🎲 Résultat : ${Math.floor(Math.random()*6)+1}` });
        break;

      case "coin":
        await sock.sendMessage(from, { text: `🪙 ${Math.random() < 0.5 ? "Pile" : "Face"}` });
        break;

      case "fortune":
        const fortunes = ["Oui","Non","Peut-être","Certainement","Jamais"];
        await sock.sendMessage(from, { text: `🔮 Réponse : ${fortunes[Math.floor(Math.random()*fortunes.length)]}` });
        break;

      case "compliment":
        const compliments = ["Tu es incroyable !","Tu gères !","Continue comme ça !"];
        await sock.sendMessage(from, { text: compliments[Math.floor(Math.random()*compliments.length)] });
        break;

      case "insulte":
        const insults = ["Espèce de farceur !","T'es nul 😂","Oh là là, sérieux ?"];
        await sock.sendMessage(from, { text: insults[Math.floor(Math.random()*insults.length)] });
        break;

      case "motdujour":
        const words = ["Épiphanie","Labyrinthe","Quotidien","Zénith","Euphorie"];
        await sock.sendMessage(from, { text: `📚 Mot du jour : ${words[Math.floor(Math.random()*words.length)]}` });
        break;

      case "joke":
        await sock.sendMessage(from, { text: "😂 Pourquoi les programmeurs confondent Halloween et Noël ? Parce que OCT 31 = DEC 25 !" });
        break;

      // ----------------- MÉDIAS -----------------
      case "sticker":
        if (m.message.imageMessage) {
          const buffer = await downloadMediaMessage(m);
          await sock.sendMessage(from, { sticker: buffer });
        } else { await sock.sendMessage(from, { text: "📸 Envoie une image avec la légende *sticker*." }); }
        break;

      case "gif":
        await sock.sendMessage(from, { text: "Fonction GIF à compléter via Tenor API." });
        break;

      case "tts":
        await sock.sendMessage(from, { text: "Fonction TTS à compléter via API TTS." });
        break;

      case "yt":
        await sock.sendMessage(from, { text: "Recherche YouTube à compléter via API YouTube." });
        break;

      case "tiktok":
        await sock.sendMessage(from, { text: "Fonction TikTok à compléter." });
        break;

      case "ig":
        await sock.sendMessage(from, { text: "Fonction Instagram à compléter." });
        break;

      case "lyrics":
        await sock.sendMessage(from, { text: "Fonction lyrics à compléter via API." });
        break;

      case "meme":
        await sock.sendMessage(from, { text: "Fonction meme à compléter via API." });
        break;

      case "photo":
        await sock.sendMessage(from, { text: "Fonction photo à compléter via API Unsplash." });
        break;

      case "avatar":
        await sock.sendMessage(from, { text: "Fonction avatar à compléter via API." });
        break;

      // ----------------- JEUX -----------------
      case "rps":
        const choices = ["pierre","papier","ciseaux"];
        const botChoice = choices[Math.floor(Math.random()*3)];
        await sock.sendMessage(from, { text: `🤖 Bot a choisi : ${botChoice}` });
        break;

      case "quiz":
      case "trivia":
      case "hangman":
      case "memory":
      case "numbergame":
      case "tic-tac-toe":
      case "coinflipgame":
      case "rockgame":
      case "slot":
        await sock.sendMessage(from, { text: `Commande ${text} activée ! (fonctionnalité à compléter)` });
        break;

      // ----------------- DIVERS -----------------
      case "fact":
      case "advice":
      case "horoscope":
      case "news":
      case "covid":
      case "stock":
      case "remind":
      case "alarm":
      case "todo
