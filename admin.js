const STORAGE_KEY = "jesinProducts";
const PROFILE_KEY = "jesinProfile";
const SOCIALS_KEY = "jesinSocials";
const GALLERY_KEY = "jesinGallery";
const TESTIMONIALS_KEY = "jesinTestimonials";
const FAQ_KEY = "jesinFaq";
const BANNER_KEY = "jesinBanner";
const SETTINGS_KEY = "jesinSettings";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

let editingProductId = null;
let editingGalleryId = null;
let editingTestimonialId = null;
let editingFaqId = null;

const defaultProfile = {
  businessName: "Jesin Food",
  logo: "",
  heroImage: "",
  description: "Jesin Food menghadirkan olahan seafood dan makanan ringan berkualitas yang cocok untuk kebutuhan keluarga maupun usaha.",
  story: "Jesin Food lahir dari semangat menghadirkan makanan favorit keluarga dengan kualitas yang konsisten, modern, dan mudah diakses.",
  vision: "Menjadi brand makanan pilihan yang dikenal dengan kualitas, rasa, dan pelayanan terbaik.",
  mission: "Menyajikan produk berkualitas tinggi dengan pelayanan yang cepat dan ramah.",
  address: "Cirebon, Jawa Barat",
  foundedYear: "2023",
  hours: "Senin - Sabtu, 08.00 - 20.00"
};

const defaultSocials = {
  whatsapp: "6281234567890",
  instagram: "@jesin.food",
  tiktok: "@jesin.food",
  facebook: "Jesin Food",
  email: "hello@jesinfood.com",
  mapsLink: "https://maps.google.com"
};

const defaultBanner = {
  heroTitle: "Dari Rajungan Asli Cirebon, Menjadi Camilan Favorit Keluarga",
  heroDescription: "Jesin Food menghadirkan olahan seafood dan makanan ringan berkualitas dengan cita rasa khas dan kemasan modern.",
  heroImage: "",
  promoTitle: "Promo Spesial",
  promoText: "Temukan produk favorit yang cocok untuk oleh-oleh, camilan keluarga, dan pesanan rutin.",
  promoButtonText: "Jelajahi Koleksi",
  recommendedProduct: ""
};

const defaultSettings = {
  siteTitle: "Jesin Food",
  themeColor: "#1f4b6d",
  favicon: "",
  seoDescription: "Jesin Food menjual berbagai olahan seafood dan makanan ringan berkualitas."
};

function getStorage(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Gagal membaca data", error);
    return fallback;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeProduct(product, index) {
  return {
    id: product.id || Date.now() + index,
    name: product.name || "Produk",
    price: product.price || "Rp0",
    description: product.description || "",
    image: product.image || "",
    category: product.category || "Produk PO",
    weight: product.weight || "",
    status: product.status || "Tersedia",
    featured: Boolean(product.featured),
    views: Number(product.views) || 0
  };
}

function getProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const fallback = [
      { id: 1, name: "Krupuk Mentah (Altisa Produk Unggulan)", price: "Rp15.000", description: "Krupuk mentah berkualitas dengan rasa gurih dan renyah saat digoreng.", image: "", category: "Produk Unggulan", weight: "500 gram", status: "Tersedia", featured: true, views: 0 },
      { id: 2, name: "Baby Crab", price: "Rp18.000", description: "Olahan baby crab yang cocok untuk camilan atau oleh-oleh keluarga.", image: "", category: "Produk Unggulan", weight: "250 gram", status: "Unggulan", featured: true, views: 0 },
      { id: 3, name: "Abon Jesin (Araco)", price: "Rp25.000 / 100 gram", description: "Abon khas yang lembut, gurih, dan siap menemani santapan Anda.", image: "", category: "Produk PO", weight: "100 gram", status: "PO", featured: false, views: 0 },
      { id: 4, name: "Krupuk Udang Ronggeng", price: "Rp15.000", description: "Krupuk udang renyah dengan rasa khas yang digemari banyak orang.", image: "", category: "Produk PO", weight: "200 gram", status: "Tersedia", featured: false, views: 0 }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback.map(normalizeProduct);
  }

  try {
    const parsed = JSON.parse(saved);
    return parsed.map(normalizeProduct);
  } catch (error) {
    console.error("Gagal membaca produk", error);
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getProfile() {
  return getStorage(PROFILE_KEY, defaultProfile);
}

function getSocials() {
  return getStorage(SOCIALS_KEY, defaultSocials);
}

function getGallery() {
  return getStorage(GALLERY_KEY, []);
}

function getTestimonials() {
  return getStorage(TESTIMONIALS_KEY, []);
}

function getFaq() {
  return getStorage(FAQ_KEY, []);
}

function getBanner() {
  return getStorage(BANNER_KEY, defaultBanner);
}

function getSettings() {
  return getStorage(SETTINGS_KEY, defaultSettings);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resetProductForm() {
  const form = document.getElementById("product-form");
  if (form) form.reset();
  editingProductId = null;
  const title = document.getElementById("form-title");
  if (title) title.textContent = "Tambah Produk";
}

function populateProductForm(product) {
  document.getElementById("product-name").value = product.name || "";
  document.getElementById("product-price").value = product.price || "";
  document.getElementById("product-weight").value = product.weight || "";
  document.getElementById("product-description").value = product.description || "";
  document.getElementById("product-image").value = product.image || "";
  document.getElementById("product-category").value = product.category || "Produk PO";
  document.getElementById("product-status").value = product.status || "Tersedia";
  document.getElementById("product-featured").checked = Boolean(product.featured);
  document.getElementById("form-title").textContent = "Edit Produk";
}

function renderAdminProducts() {
  const list = document.getElementById("admin-product-list");
  if (!list) return;

  const products = getProducts();
  list.innerHTML = "";

  if (!products.length) {
    list.innerHTML = "<p>Belum ada produk.</p>";
    return;
  }

  products.forEach((product) => {
    const item = document.createElement("div");
    item.className = "admin-product-item";
    item.innerHTML = `
      ${product.image ? `<img src="${product.image}" alt="${product.name}" />` : ""}
      <h3>${product.name}</h3>
      <p><strong>Harga:</strong> ${product.price}</p>
      <p><strong>Kategori:</strong> ${product.category}</p>
      <p><strong>Status:</strong> ${product.status || "Tersedia"}</p>
      <p>${product.description}</p>
      <div class="admin-actions">
        <button class="btn btn-secondary" data-action="edit-product" data-id="${product.id}">Edit</button>
        <button class="btn btn-primary" data-action="delete-product" data-id="${product.id}">Hapus</button>
      </div>
    `;
    list.appendChild(item);
  });

  fillRecommendedProductOptions(products);
}

function fillRecommendedProductOptions(products) {
  const select = document.getElementById("recommended-product");
  if (!select) return;
  const current = select.value;
  select.innerHTML = '<option value="">Pilih produk</option>';
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    select.appendChild(option);
  });
  if (current) select.value = current;
}

function renderDashboard() {
  const products = getProducts();
  const featured = products.filter((item) => item.featured || item.category === "Produk Unggulan").length;
  const po = products.filter((item) => item.category === "Produk PO").length;
  const whatsappClicks = Number(localStorage.getItem("jesinWhatsappClicks") || 0);
  const topProduct = [...products].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  document.getElementById("stat-total-products").textContent = products.length;
  document.getElementById("stat-featured-products").textContent = featured;
  document.getElementById("stat-po-products").textContent = po;
  document.getElementById("stat-whatsapp-clicks").textContent = whatsappClicks;

  const summary = document.getElementById("stats-summary");
  if (summary) {
    summary.innerHTML = `
      <div class="summary-item">Produk tersedia: ${products.filter((item) => item.status !== "Habis").length}</div>
      <div class="summary-item">Produk habis: ${products.filter((item) => item.status === "Habis").length}</div>
      <div class="summary-item">Produk unggulan: ${featured}</div>
      <div class="summary-item">Produk PO: ${po}</div>
    `;
  }

  const mostViewed = document.getElementById("most-viewed-product");
  if (mostViewed) {
    mostViewed.innerHTML = topProduct
      ? `<div class="summary-item">${topProduct.name} (${topProduct.views || 0} kali dilihat)</div>`
      : '<div class="summary-item">Belum ada data</div>';
  }
}

function renderProfilePreview() {
  const profile = getProfile();
  const preview = document.getElementById("profile-preview");
  if (!preview) return;
  preview.innerHTML = `
    <div><strong>${profile.businessName || "Jesin Food"}</strong></div>
    <div>${profile.description || ""}</div>
    <div>${profile.address || ""}</div>
    <div>${profile.hours || ""}</div>
  `;
}

function renderSocialPreview() {
  const socials = getSocials();
  const preview = document.getElementById("social-preview");
  if (!preview) return;
  preview.innerHTML = `
    <div>WhatsApp: ${socials.whatsapp || "-"}</div>
    <div>Instagram: ${socials.instagram || "-"}</div>
    <div>TikTok: ${socials.tiktok || "-"}</div>
    <div>Email: ${socials.email || "-"}</div>
  `;
}

function renderGallery() {
  const list = document.getElementById("gallery-list");
  if (!list) return;
  const items = getGallery();
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = "<p>Belum ada item galeri.</p>";
    return;
  }
  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "admin-product-item";
    card.innerHTML = `
      ${item.url ? (item.type === "video" ? `<video controls src="${item.url}" style="width:100%;border-radius:12px"></video>` : `<img src="${item.url}" alt="${item.title}" />`) : ""}
      <h3>${item.title || "Item"}</h3>
      <p>${item.type || "photo"}</p>
      <div class="admin-actions">
        <button class="btn btn-secondary" data-action="edit-gallery" data-id="${item.id}">Edit</button>
        <button class="btn btn-secondary" data-action="move-gallery-up" data-id="${item.id}">Naik</button>
        <button class="btn btn-secondary" data-action="move-gallery-down" data-id="${item.id}">Turun</button>
        <button class="btn btn-primary" data-action="delete-gallery" data-id="${item.id}">Hapus</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderTestimonials() {
  const list = document.getElementById("testimonial-list");
  if (!list) return;
  const items = getTestimonials();
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = "<p>Belum ada testimoni.</p>";
    return;
  }
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "admin-product-item";
    card.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ""}
      <h3>${item.name}</h3>
      <p>${item.role || ""}</p>
      <p>Rating: ${item.rating || 5}/5</p>
      <p>${item.comment || ""}</p>
      <div class="admin-actions">
        <button class="btn btn-secondary" data-action="edit-testimonial" data-id="${item.id}">Edit</button>
        <button class="btn btn-primary" data-action="delete-testimonial" data-id="${item.id}">Hapus</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderFaq() {
  const list = document.getElementById("faq-list");
  if (!list) return;
  const items = getFaq();
  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = "<p>Belum ada FAQ.</p>";
    return;
  }
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "admin-product-item";
    card.innerHTML = `
      <h3>${item.question}</h3>
      <p>${item.answer}</p>
      <div class="admin-actions">
        <button class="btn btn-secondary" data-action="edit-faq" data-id="${item.id}">Edit</button>
        <button class="btn btn-primary" data-action="delete-faq" data-id="${item.id}">Hapus</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function renderBannerPreview() {
  const banner = getBanner();
  const preview = document.getElementById("banner-preview");
  if (!preview) return;
  preview.innerHTML = `
    <div><strong>${banner.heroTitle || "Hero"}</strong></div>
    <div>${banner.heroDescription || ""}</div>
    <div>${banner.promoTitle || "Promo"}: ${banner.promoText || ""}</div>
  `;
}

function renderSettingsPreview() {
  const settings = getSettings();
  const preview = document.getElementById("settings-preview");
  if (!preview) return;
  preview.innerHTML = `
    <div><strong>${settings.siteTitle || "Jesin Food"}</strong></div>
    <div>Warna tema: ${settings.themeColor || "#1f4b6d"}</div>
    <div>SEO: ${settings.seoDescription || ""}</div>
  `;
}

function renderAll() {
  renderAdminProducts();
  renderDashboard();
  renderProfilePreview();
  renderSocialPreview();
  renderGallery();
  renderTestimonials();
  renderFaq();
  renderBannerPreview();
  renderSettingsPreview();
}

function populateProfileForm() {
  const profile = getProfile();
  document.getElementById("business-name").value = profile.businessName || "";
  document.getElementById("business-logo").value = profile.logo || "";
  document.getElementById("business-hero").value = profile.heroImage || "";
  document.getElementById("business-description").value = profile.description || "";
  document.getElementById("business-story").value = profile.story || "";
  document.getElementById("business-vision").value = profile.vision || "";
  document.getElementById("business-mission").value = profile.mission || "";
  document.getElementById("business-address").value = profile.address || "";
  document.getElementById("business-founded").value = profile.foundedYear || "";
  document.getElementById("business-hours").value = profile.hours || "";
}

function populateSocialForm() {
  const socials = getSocials();
  document.getElementById("social-whatsapp").value = socials.whatsapp || "";
  document.getElementById("social-instagram").value = socials.instagram || "";
  document.getElementById("social-tiktok").value = socials.tiktok || "";
  document.getElementById("social-facebook").value = socials.facebook || "";
  document.getElementById("social-email").value = socials.email || "";
  document.getElementById("social-maps").value = socials.mapsLink || "";
}

function populateBannerForm() {
  const banner = getBanner();
  document.getElementById("banner-title").value = banner.heroTitle || "";
  document.getElementById("banner-description").value = banner.heroDescription || "";
  document.getElementById("banner-image").value = banner.heroImage || "";
  document.getElementById("promo-title").value = banner.promoTitle || "";
  document.getElementById("promo-text").value = banner.promoText || "";
  document.getElementById("promo-button").value = banner.promoButtonText || "";
  document.getElementById("recommended-product").value = banner.recommendedProduct || "";
}

function populateSettingsForm() {
  const settings = getSettings();
  document.getElementById("site-title").value = settings.siteTitle || "";
  document.getElementById("theme-color").value = settings.themeColor || "#1f4b6d";
  document.getElementById("favicon-url").value = settings.favicon || "";
  document.getElementById("seo-description").value = settings.seoDescription || "";
}

function populateGalleryForm(item) {
  document.getElementById("gallery-title").value = item?.title || "";
  document.getElementById("gallery-type").value = item?.type || "photo";
  document.getElementById("gallery-url").value = item?.url || "";
  document.getElementById("gallery-form").querySelector("button").textContent = item ? "Update Item" : "Tambah Item";
}

function populateTestimonialForm(item) {
  document.getElementById("testimonial-name").value = item?.name || "";
  document.getElementById("testimonial-role").value = item?.role || "";
  document.getElementById("testimonial-comment").value = item?.comment || "";
  document.getElementById("testimonial-rating").value = item?.rating || "";
  document.getElementById("testimonial-image").value = item?.image || "";
  document.getElementById("testimonial-form").querySelector("button").textContent = item ? "Update Testimoni" : "Tambah Testimoni";
}

function populateFaqForm(item) {
  document.getElementById("faq-question").value = item?.question || "";
  document.getElementById("faq-answer").value = item?.answer || "";
  document.getElementById("faq-form").querySelector("button").textContent = item ? "Update FAQ" : "Simpan FAQ";
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    document.getElementById("login-panel").classList.add("hidden");
    document.getElementById("admin-panel").classList.remove("hidden");
    document.getElementById("logout-btn").classList.remove("hidden");
    renderAll();
    populateProfileForm();
    populateSocialForm();
    populateBannerForm();
    populateSettingsForm();
  } else {
    alert("Username atau password salah.");
  }
}

function handleLogout() {
  document.getElementById("login-panel").classList.remove("hidden");
  document.getElementById("admin-panel").classList.add("hidden");
  document.getElementById("logout-btn").classList.add("hidden");
  document.getElementById("login-form").reset();
  resetProductForm();
}

async function handleProductSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  let image = formData.get("image") || "";
  const fileInput = document.getElementById("product-image-file");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    image = await readFileAsDataUrl(fileInput.files[0]);
  }

  const payload = {
    id: editingProductId || Date.now(),
    name: formData.get("name") || "Produk",
    price: formData.get("price") || "Rp0",
    weight: formData.get("weight") || "",
    description: formData.get("description") || "",
    image,
    category: formData.get("category") || "Produk PO",
    status: formData.get("status") || "Tersedia",
    featured: Boolean(formData.get("featured")),
    views: 0
  };

  const products = getProducts();
  if (editingProductId) {
    const index = products.findIndex((item) => item.id === editingProductId);
    if (index >= 0) products[index] = { ...products[index], ...payload };
  } else {
    products.push(payload);
  }
  saveProducts(products);
  resetProductForm();
  renderAll();
  alert(editingProductId ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan");
}

function handleProductActions(event) {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  if (!action || !id) return;

  const products = getProducts();
  if (action === "delete-product") {
    const filtered = products.filter((item) => item.id !== id);
    saveProducts(filtered);
    renderAll();
    alert("Produk berhasil dihapus");
  }

  if (action === "edit-product") {
    const product = products.find((item) => item.id === id);
    if (product) {
      editingProductId = product.id;
      populateProductForm(product);
      document.getElementById("products-view").scrollIntoView({ behavior: "smooth" });
    }
  }
}

async function handleProfileSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  let logo = formData.get("logo") || "";
  let heroImage = formData.get("heroImage") || "";
  const logoFile = document.getElementById("business-logo-file");
  const heroFile = document.getElementById("business-hero-file");
  if (logoFile && logoFile.files && logoFile.files[0]) logo = await readFileAsDataUrl(logoFile.files[0]);
  if (heroFile && heroFile.files && heroFile.files[0]) heroImage = await readFileAsDataUrl(heroFile.files[0]);

  const profile = {
    businessName: formData.get("businessName") || "Jesin Food",
    logo,
    heroImage,
    description: formData.get("description") || "",
    story: formData.get("story") || "",
    vision: formData.get("vision") || "",
    mission: formData.get("mission") || "",
    address: formData.get("address") || "",
    foundedYear: formData.get("foundedYear") || "",
    hours: formData.get("hours") || ""
  };
  setStorage(PROFILE_KEY, profile);
  renderProfilePreview();
  alert("Profil usaha berhasil disimpan");
}

async function handleSocialSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const socials = {
    whatsapp: formData.get("whatsapp") || "",
    instagram: formData.get("instagram") || "",
    tiktok: formData.get("tiktok") || "",
    facebook: formData.get("facebook") || "",
    email: formData.get("email") || "",
    mapsLink: formData.get("mapsLink") || ""
  };
  setStorage(SOCIALS_KEY, socials);
  renderSocialPreview();
  alert("Kontak dan sosial media berhasil diperbarui");
}

async function handleGallerySubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  let url = formData.get("url") || "";
  const fileInput = document.getElementById("gallery-file");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    url = await readFileAsDataUrl(fileInput.files[0]);
  }
  const items = getGallery();
  const payload = {
    id: editingGalleryId || Date.now(),
    title: formData.get("title") || "Item",
    type: formData.get("type") || "photo",
    url
  };
  if (editingGalleryId) {
    const index = items.findIndex((item) => item.id === editingGalleryId);
    if (index >= 0) items[index] = { ...items[index], ...payload };
  } else {
    items.push(payload);
  }
  setStorage(GALLERY_KEY, items);
  renderGallery();
  event.target.reset();
  editingGalleryId = null;
  document.getElementById("gallery-form").querySelector("button").textContent = "Tambah Item";
  alert("Galeri berhasil disimpan");
}

function handleGalleryActions(event) {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  if (!action || !id) return;
  const items = getGallery();
  if (action === "delete-gallery") {
    setStorage(GALLERY_KEY, items.filter((item) => item.id !== id));
    renderGallery();
  }
  if (action === "edit-gallery") {
    const item = items.find((galleryItem) => galleryItem.id === id);
    if (item) {
      editingGalleryId = item.id;
      populateGalleryForm(item);
    }
  }
  if (action === "move-gallery-up") {
    const index = items.findIndex((item) => item.id === id);
    if (index > 0) {
      const swapped = [...items];
      [swapped[index - 1], swapped[index]] = [swapped[index], swapped[index - 1]];
      setStorage(GALLERY_KEY, swapped);
      renderGallery();
    }
  }
  if (action === "move-gallery-down") {
    const index = items.findIndex((item) => item.id === id);
    if (index >= 0 && index < items.length - 1) {
      const swapped = [...items];
      [swapped[index], swapped[index + 1]] = [swapped[index + 1], swapped[index]];
      setStorage(GALLERY_KEY, swapped);
      renderGallery();
    }
  }
}

async function handleTestimonialSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  let image = formData.get("image") || "";
  const fileInput = document.getElementById("testimonial-image-file");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    image = await readFileAsDataUrl(fileInput.files[0]);
  }
  const items = getTestimonials();
  const payload = {
    id: editingTestimonialId || Date.now(),
    name: formData.get("name") || "",
    role: formData.get("role") || "",
    comment: formData.get("comment") || "",
    rating: formData.get("rating") || 5,
    image
  };
  if (editingTestimonialId) {
    const index = items.findIndex((item) => item.id === editingTestimonialId);
    if (index >= 0) items[index] = { ...items[index], ...payload };
  } else {
    items.push(payload);
  }
  setStorage(TESTIMONIALS_KEY, items);
  renderTestimonials();
  event.target.reset();
  editingTestimonialId = null;
  document.getElementById("testimonial-form").querySelector("button").textContent = "Tambah Testimoni";
  alert("Testimoni berhasil disimpan");
}

function handleTestimonialActions(event) {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  if (!action || !id) return;
  const items = getTestimonials();
  if (action === "delete-testimonial") {
    setStorage(TESTIMONIALS_KEY, items.filter((item) => item.id !== id));
    renderTestimonials();
  }
  if (action === "edit-testimonial") {
    const item = items.find((testimonial) => testimonial.id === id);
    if (item) {
      editingTestimonialId = item.id;
      populateTestimonialForm(item);
    }
  }
}

async function handleFaqSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const items = getFaq();
  const payload = {
    id: editingFaqId || Date.now(),
    question: formData.get("question") || "",
    answer: formData.get("answer") || ""
  };
  if (editingFaqId) {
    const index = items.findIndex((item) => item.id === editingFaqId);
    if (index >= 0) items[index] = { ...items[index], ...payload };
  } else {
    items.push(payload);
  }
  setStorage(FAQ_KEY, items);
  renderFaq();
  event.target.reset();
  editingFaqId = null;
  document.getElementById("faq-form").querySelector("button").textContent = "Simpan FAQ";
  alert("FAQ berhasil disimpan");
}

function handleFaqActions(event) {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  if (!action || !id) return;
  const items = getFaq();
  if (action === "delete-faq") {
    setStorage(FAQ_KEY, items.filter((item) => item.id !== id));
    renderFaq();
  }
  if (action === "edit-faq") {
    const item = items.find((faq) => faq.id === id);
    if (item) {
      editingFaqId = item.id;
      populateFaqForm(item);
    }
  }
}

async function handleBannerSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  let heroImage = formData.get("heroImage") || "";
  const fileInput = document.getElementById("banner-image-file");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    heroImage = await readFileAsDataUrl(fileInput.files[0]);
  }
  const banner = {
    heroTitle: formData.get("heroTitle") || "",
    heroDescription: formData.get("heroDescription") || "",
    heroImage,
    promoTitle: formData.get("promoTitle") || "",
    promoText: formData.get("promoText") || "",
    promoButtonText: formData.get("promoButtonText") || "",
    recommendedProduct: formData.get("recommendedProduct") || ""
  };
  setStorage(BANNER_KEY, banner);
  renderBannerPreview();
  alert("Banner dan promo berhasil diperbarui");
}

async function handleSettingsSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  let favicon = formData.get("favicon") || "";
  const fileInput = document.getElementById("favicon-file");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    favicon = await readFileAsDataUrl(fileInput.files[0]);
  }
  const settings = {
    siteTitle: formData.get("siteTitle") || "Jesin Food",
    themeColor: formData.get("themeColor") || "#1f4b6d",
    favicon,
    seoDescription: formData.get("seoDescription") || ""
  };
  setStorage(SETTINGS_KEY, settings);
  renderSettingsPreview();
  alert("Pengaturan website berhasil disimpan");
}

function switchSection(sectionId) {
  document.querySelectorAll(".admin-view").forEach((view) => view.classList.add("hidden"));
  document.querySelectorAll(".sidebar-link").forEach((link) => link.classList.remove("active"));
  document.getElementById(`${sectionId}-view`)?.classList.remove("hidden");
  document.querySelector(`[data-section="${sectionId}"]`)?.classList.add("active");
}

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const productForm = document.getElementById("product-form");
  const logoutBtn = document.getElementById("logout-btn");
  const cancelEdit = document.getElementById("cancel-edit");
  const adminList = document.getElementById("admin-product-list");
  const profileForm = document.getElementById("profile-form");
  const socialForm = document.getElementById("social-form");
  const galleryForm = document.getElementById("gallery-form");
  const testimonialForm = document.getElementById("testimonial-form");
  const faqForm = document.getElementById("faq-form");
  const bannerForm = document.getElementById("banner-form");
  const settingsForm = document.getElementById("settings-form");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");

  if (loginForm) loginForm.addEventListener("submit", handleLogin);
  if (productForm) productForm.addEventListener("submit", handleProductSubmit);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  if (cancelEdit) cancelEdit.addEventListener("click", resetProductForm);
  if (adminList) adminList.addEventListener("click", handleProductActions);
  if (profileForm) profileForm.addEventListener("submit", handleProfileSubmit);
  if (socialForm) socialForm.addEventListener("submit", handleSocialSubmit);
  if (galleryForm) galleryForm.addEventListener("submit", handleGallerySubmit);
  if (testimonialForm) testimonialForm.addEventListener("submit", handleTestimonialSubmit);
  if (faqForm) faqForm.addEventListener("submit", handleFaqSubmit);
  if (bannerForm) bannerForm.addEventListener("submit", handleBannerSubmit);
  if (settingsForm) settingsForm.addEventListener("submit", handleSettingsSubmit);

  document.getElementById("gallery-list")?.addEventListener("click", handleGalleryActions);
  document.getElementById("testimonial-list")?.addEventListener("click", handleTestimonialActions);
  document.getElementById("faq-list")?.addEventListener("click", handleFaqActions);
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => switchSection(link.dataset.section));
  });

  populateProfileForm();
  populateSocialForm();
  populateBannerForm();
  populateSettingsForm();
  renderAll();
});
