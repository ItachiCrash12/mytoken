//CREDIT: @OBITOBOYS
const fs = require("fs");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const BOT_TOKEN = "TOKENS";
const ADMIN_FILE = "admin.json";
const RESELLER_FILE = "ress.json";
const MODERATOR_FILE = "mods.json";
const CEO_FILE = "ceo.json";
const OWNER_FILE = "tertinggi.json";
const GITHUB_REPO = "Owner/Repo";
const GITHUB_FILE_PATH = "tokens.json";
const GITHUB_PAT = "ghp"; 


const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${GITHUB_FILE_PATH}?timestamp=${Date.now()}`;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;


async function fetchTokens() {
  try {
    const response = await axios.get(GITHUB_RAW_URL, { headers: { "Cache-Control": "no-cache" } });
    return response.data?.tokens || [];
  } catch (error) {
    return [];
  }
}

async function updateTokens(newTokens) {
  try {
    const { data } = await axios.get(GITHUB_API_URL, {
      headers: { Authorization: `token ${GITHUB_PAT}` },
    });

    const updatedContent = Buffer.from(JSON.stringify({ tokens: newTokens }, null, 2)).toString("base64");

    await axios.put(
      GITHUB_API_URL,
      { message: "Update token list", content: updatedContent, sha: data.sha },
      { headers: { Authorization: `token ${GITHUB_PAT}` } }
    );

    return true;
  } catch (error) {
    return false;
  }
}


const bot = new TelegramBot(BOT_TOKEN, { polling: true });

function loadAdmins() {
  if (!fs.existsSync(ADMIN_FILE)) return { owners: [], admins: [] };
  return JSON.parse(fs.readFileSync(ADMIN_FILE));
}

function loadResellers() {
  if (!fs.existsSync(RESELLER_FILE)) return { resellers: [] };
  return JSON.parse(fs.readFileSync(RESELLER_FILE));
}

function loadModerators() {
  if (!fs.existsSync(MODERATOR_FILE)) return { moderators: [] };
  return JSON.parse(fs.readFileSync(MODERATOR_FILE));
}

function loadCeos() {
  if (!fs.existsSync(CEO_FILE)) return { ceos: [] };
  return JSON.parse(fs.readFileSync(CEO_FILE));
}

function loadOwners() {
  if (!fs.existsSync(OWNER_FILE)) return { owners: [] };
  return JSON.parse(fs.readFileSync(OWNER_FILE));
}

function saveAdmins(adminData) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(adminData, null, 2));
}

function saveResellers(resellerData) {
  fs.writeFileSync(RESELLER_FILE, JSON.stringify(resellerData, null, 2));
}

function saveModerators(moderatorData) {
  fs.writeFileSync(MODERATOR_FILE, JSON.stringify(moderatorData, null, 2));
}

function saveCeos(ceoData) {
  fs.writeFileSync(CEO_FILE, JSON.stringify(ceoData, null, 2));
}

function saveOwners(ownerData) {
  fs.writeFileSync(OWNER_FILE, JSON.stringify(ownerData, null, 2));
}

function isOwner(userId) {
  return loadAdmins().owners.includes(userId);
}

function isModerator(userId) {
  return loadModerators().moderators.includes(userId);
}

function isCeo(userId) {
  return loadCeos().ceos.includes(userId);
}

function isOWNER(userId) {
  return loadOwners().owners.includes(userId);
}

function isAdmin(userId) {
  const { admins, owners } = loadAdmins();
  return owners.includes(userId) || admins.includes(userId);
}

function isReseller(userId) {
  return loadResellers().resellers.includes(userId);
}

function hasAccess(userId) {
  return isOwner(userId) || isAdmin(userId) || isReseller(userId) || isModerator(userId) || isCeo(userId) || isOWNER(userId);
}

const MENU_IMAGE = "https://files.catbox.moe/duv2e0.jpg";

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!hasAccess(userId)) {
    return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
  }

  const menuText = `
\`\`\`
╔═━━━〔 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐃𝐀𝐓𝐀𝐁𝐀𝐒𝐄 〕━━━⬣
║Script Name : 𝐃𝐀𝐓𝐀𝐁𝐀𝐒𝐄 𝐒𝐘𝐒𝐓𝐄𝐌
║Owner : @NamaKalian
║Version : 1.0.0 Stable
║Status: Online & Secured
┗━━━━━━━━━━━━━━━━━━━━━━━━━━⬣
\`\`\`
`;

  const buttons = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Owner Menu", callback_data: "owner_menu" }],
        [{ text: "Token Menu", callback_data: "token_menu" }],
        [{ text: "Partner Menu", callback_data: "partner_menu" }],
        [{ text: "Moderator Menu", callback_data: "mod_menu" }],
        [{ text: "CEO Menu", callback_data: "ceo_menu" }],
        [{ text: "Dev Menu", callback_data: "dev_menu" }]
      ]
    },
    parse_mode: "MarkdownV2"
  };

  bot.sendPhoto(chatId, MENU_IMAGE, { caption: menuText, ...buttons });
});

// 🔹 Callback handler button
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  let replyText;

  switch (data) {
    case "owner_menu":
      replyText = `\`\`\`
╔═⊱ 𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔 ─═⬣
║ /addtoken
║ /deltoken
║ /listtoken
║ /addmod
║ /delmod
║ /addpt
║ /delpt
║ /addreseller
║ /delreseller
┗━━━━━━━━━━━━━━━⬣
\`\`\``;
      break;

    case "token_menu":
      replyText = `\`\`\`
╔═⊱ 𝐓𝐎𝐊𝐄𝐍 𝐌𝐄𝐍𝐔 ─═⬣
║ /addtoken
║ /deltoken
║ /listtoken
┗━━━━━━━━━━━━━━━⬣
\`\`\``;
      break;

    case "partner_menu":
      replyText = `\`\`\`
╔═⊱ 𝐏𝐀𝐑𝐓𝐍𝐄𝐑 𝐌𝐄𝐍𝐔 ─═⬣
║ /addreseller
║ /delreseller
║ /listreseller
┗━━━━━━━━━━━━━━━⬣
\`\`\``;
      break;

    case "mod_menu":
      replyText = `\`\`\`
╔═⊱ 𝐌𝐎𝐃𝐄𝐑𝐀𝐓𝐎𝐑 𝐌𝐄𝐍𝐔 ─═⬣
║ /addpt
║ /delpt
║ /addreseller
║ /delreseller
┗━━━━━━━━━━━━━━━⬣
\`\`\``;
      break;

    case "ceo_menu":
      replyText = `\`\`\`
╔═⊱ 𝐂𝐄𝐎 𝐌𝐄𝐍𝐔 ─═⬣
║ /addmod
║ /delmod
║ /addpt
║ /delpt
║ /addreseller
║ /delreseller
┗━━━━━━━━━━━━━━━⬣
\`\`\``;
      break;

    case "dev_menu":
      replyText = `\`\`\`
╔═⊱ DEVELOPERS MENU ─═⬣
║ /addtoken
║ /deltoken
║ /listtoken
║ /addmod
║ /delmod
║ /addpt
║ /delpt
║ /addreseller
║ /delreseller
║ /addowner
║ /delowner
┗━━━━━━━━━━━━━━━⬣
\`\`\``;
      break;

    default:
      replyText = "❌ Menu tidak dikenal.";
      break;
  }

  bot.answerCallbackQuery(query.id);
  bot.editMessageCaption(replyText, {
    chat_id: chatId,
    message_id: query.message.message_id,
    parse_mode: "MarkdownV2",
    reply_markup: query.message.reply_markup
  });
});


bot.onText(/\/addpt (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const newAdminId = parseInt(match[1]);

  if (!isOwner(userId) && !isModerator(userId) && !isCeo(userId) && !isOWNER(userId)) return bot.sendMessage(chatId, "❌ Hanya yang memiliki akses bisa menambah partner!");
  if (isNaN(newAdminId)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const adminData = loadAdmins();
  if (adminData.admins.includes(newAdminId)) return bot.sendMessage(chatId, "⚠️ Partners sudah ada!");

  adminData.admins.push(newAdminId);
  saveAdmins(adminData);
  bot.sendMessage(chatId, `✅ Partner berhasil ditambahkan: ${newAdminId}`);
});

bot.onText(/\/delpt (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const adminToRemove = parseInt(match[1]);

  if (!isOwner(userId)) return bot.sendMessage(chatId, "❌ Hanya yang memiliki akses bisa menghapus PT");
  if (isNaN(adminToRemove)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const adminData = loadAdmins();
  if (!adminData.admins.includes(adminToRemove)) return bot.sendMessage(chatId, "⚠️ Partner tidak ditemukan!");

  adminData.admins = adminData.admins.filter((id) => id !== adminToRemove);
  saveAdmins(adminData);
  bot.sendMessage(chatId, `✅ Partners tambahan berhasil dihapus: ${adminToRemove}`);
});


bot.onText(/\/addreseller (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const newResellerId = parseInt(match[1]);

  if (!isAdmin(userId) && !isOwner(userId) && !isModerator(userId) && !isCeo(userId) && !isOWNER(userId)) return bot.sendMessage(chatId, "❌ Hanya owner dan admin yang bisa menambah reseller!");
  if (isNaN(newResellerId)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const resellerData = loadResellers();
  if (resellerData.resellers.includes(newResellerId)) return bot.sendMessage(chatId, "⚠️ Reseller sudah ada!");

  resellerData.resellers.push(newResellerId);
  saveResellers(resellerData);
  bot.sendMessage(chatId, `✅ Reseller berhasil ditambahkan: ${newResellerId}`);
});

bot.onText(/\/delreseller (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const resellerToRemove = parseInt(match[1]);

  if (!isAdmin(userId) && !isOwner(userId) && !isModerator(userId) && !isCeo(userId) && !isOWNER(userId)) return bot.sendMessage(chatId, "❌ Hanya owner dan admin yang bisa menghapus reseller!");
  if (isNaN(resellerToRemove)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const resellerData = loadResellers();
  if (!resellerData.resellers.includes(resellerToRemove)) return bot.sendMessage(chatId, "⚠️ Reseller tidak ditemukan!");

  resellerData.resellers = resellerData.resellers.filter((id) => id !== resellerToRemove);
  saveResellers(resellerData);
  bot.sendMessage(chatId, `✅ Reseller berhasil dihapus: ${resellerToRemove}`);
});

bot.onText(/\/listreseller/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");
  }

  const resellers = loadResellers().resellers || [];
  bot.sendMessage(chatId, `👥 **Daftar Reseller:**\n\n${resellers.map((r, i) => `${i + 1}. ${r}`).join("\n") || "🚫 Tidak ada reseller!"}`, { parse_mode: "Markdown" });
});

bot.onText(/\/addmod (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const newModeratorId = parseInt(match[1]);

  if (!isOwner(userId) && !isCeo(userId) && !isOWNER(userId)) return bot.sendMessage(chatId, "❌ Hanya yang memiliki akses bisa menambah mod!");
  if (isNaN(newModeratorId)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const moderatorData = loadModerators();
  if (moderatorData.moderators.includes(newModeratorId)) return bot.sendMessage(chatId, "⚠️ Moderator sudah ada!");

  moderatorData.moderators.push(newModeratorId);
  saveModerators(moderatorData);
  bot.sendMessage(chatId, `✅ Moderator berhasil ditambahkan: ${newModeratorId}`);
});

bot.onText(/\/delmod (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const moderatorToRemove = parseInt(match[1]);

  if (!isOwner(userId) && !isCeo(userId) && !isOWNER(userId)) return bot.sendMessage(chatId, "❌ Hanya yang memiliki akses bisa menghapus mod!");
  if (isNaN(moderatorToRemove)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const moderatorData = loadModerators();
  if (!moderatorData.moderators.includes(moderatorToRemove)) return bot.sendMessage(chatId, "⚠️ Mod tidak ditemukan!");

  moderatorData.moderators = moderatorData.moderators.filter((id) => id !== moderatorToRemove);
  saveModerators(moderatorData);
  bot.sendMessage(chatId, `✅ Mod berhasil dihapus: ${moderatorToRemove}`);
});

bot.onText(/\/addceo (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const newCeoId = parseInt(match[1]);

  if (!isOwner(userId) && !isOWNER(userId)) return bot.sendMessage(chatId, "❌ Hanya yang memiliki akses bisa menambah ceo!");
  if (isNaN(newCeoId)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const ceoData = loadCeos();
  if (ceoData.ceos.includes(newCeoId)) return bot.sendMessage(chatId, "⚠️ Ceo sudah ada!");

  ceoData.ceos.push(newCeoId);
  saveCeos(ceoData);
  bot.sendMessage(chatId, `✅ Ceo berhasil ditambahkan: ${newCeoId}`);
});

bot.onText(/\/delceo (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const ceoToRemove = parseInt(match[1]);

  if (!isOwner(userId) && !isOWNER(userId)) return bot.sendMessage(chatId, "❌ Hanya yang memiliki akses yang dapat menghapus ceo!");
  if (isNaN(moderatorToRemove)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const ceoData = loadCeos();
  if (!ceoData.ceos.includes(ceoToRemove)) return bot.sendMessage(chatId, "⚠️ Ceo tidak ditemukan!");

  ceoData.ceos = ceoData.ceos.filter((id) => id !== ceoToRemove);
  saveCeos(ceoData);
  bot.sendMessage(chatId, `✅ Ceo Berhasil dihapus: ${moderatorToRemove}`);
});

bot.onText(/\/addowner (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const newOWNERId = parseInt(match[1]);

  if (!isOwner(userId)) return bot.sendMessage(chatId, "❌ Hanya Dev yang memiliki akses bisa menambah Owner!");
  if (isNaN(newOWNERId)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const ownerData = loadOwners();
  if (ownerData.owners.includes(newOWNERId)) return bot.sendMessage(chatId, "⚠️ Owner sudah ada!");

  ownerData.owners.push(newOWNERId);
  saveOwners(ownerData);
  bot.sendMessage(chatId, `✅ Owner berhasil ditambahkan: ${newOWNERId}`);
});

bot.onText(/\/delowner (\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const OWNToRemove = parseInt(match[1]);

  if (!isOwner(userId)) return bot.sendMessage(chatId, "❌ Hanya yang memiliki akses yang dapat menghapus Owner!");
  if (isNaN(OWNToRemove)) return bot.sendMessage(chatId, "❌ ID harus berupa angka!");

  const ownerData = loadOwners();
  if (!ownerData.owners.includes(OWNToRemove)) return bot.sendMessage(chatId, "⚠️ Owner tidak ditemukan!");

  ownerData.owners = ownerData.owners.filter((id) => id !== OWNToRemove);
  saveOwners(ownerData);
  bot.sendMessage(chatId, `✅ Owner Berhasil dihapus: ${OWNToRemove}`);
});

bot.onText(/\/addtoken (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const newToken = match[1].trim();
    if (!hasAccess(msg.from.id)) return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");

  let tokens = await fetchTokens();
  if (tokens.includes(newToken)) return bot.sendMessage(chatId, "⚠️ Token sudah ada!");

  tokens.push(newToken);
  const success = await updateTokens(tokens);

  if (success) bot.sendMessage(chatId, `✅ Token berhasil ditambahkan!`);
  else bot.sendMessage(chatId, "❌ Gagal menambahkan token!");
});


bot.onText(/\/deltoken (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tokenToRemove = match[1].trim();
    if (!hasAccess(msg.from.id)) return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");

  let tokens = await fetchTokens();
  if (!tokens.includes(tokenToRemove)) return bot.sendMessage(chatId, "⚠️ Token tidak ditemukan!");

  tokens = tokens.filter((token) => token !== tokenToRemove);
  const success = await updateTokens(tokens);

  if (success) bot.sendMessage(chatId, `✅ Token berhasil dihapus!`);
  else bot.sendMessage(chatId, "❌ Gagal menghapus token!");
});

bot.onText(/\/listtoken/, async (msg) => {
  const chatId = msg.chat.id;
  const tokens = await fetchTokens();
    if (!hasAccess(msg.from.id)) return bot.sendMessage(chatId, "❌ Anda tidak memiliki akses!");

  if (tokens.length === 0) return bot.sendMessage(chatId, "⚠️ Tidak ada token tersimpan.");

  let tokenList = tokens.map((t) => `${t.slice(0, 3)}***${t.slice(-3)}`).join("\n");
  bot.sendMessage(chatId, `📜 **Daftar Token:**\n\`\`\`${tokenList}\`\`\``, { parse_mode: "Markdown" });
});


fetchTokens();
console.log("Bot Token Manager berjalan...");