const STORAGE_KEY = "jesinProducts";
const PROFILE_KEY = "jesinProfile";
const SOCIALS_KEY = "jesinSocials";
const GALLERY_KEY = "jesinGallery";
const TESTIMONIALS_KEY = "jesinTestimonials";
const FAQ_KEY = "jesinFaq";
const BANNER_KEY = "jesinBanner";
const SETTINGS_KEY = "jesinSettings";
const WHATSAPP_CLICKS_KEY = "jesinWhatsappClicks";

const seedProducts = [
  {
    id: 1,
    name: "Krupuk Mentah (Altisa Produk Unggulan)",
    price: "Rp15.000",
    description: "Krupuk mentah berkualitas dengan rasa gurih dan renyah saat digoreng.",
    image: "",
    category: "Produk Unggulan",
    weight: "500 gram",
    status: "Tersedia",
    featured: true,
    views: 0
  },
  {
    id: 2,
    name: "Baby Crab",
    price: "Rp18.000",
    description: "Olahan baby crab yang cocok untuk camilan atau oleh-oleh keluarga.",
    image: "",
    category: "Produk Unggulan",
    weight: "250 gram",
    status: "Unggulan",
    featured: true,
    views: 0
  },
  {
    id: 3,
    name: "Abon Jesin (Araco)",
    price: "Rp25.000 / 100 gram",
    description: "Abon khas yang lembut, gurih, dan siap menemani santapan Anda.",
    image: "",
    category: "Produk PO",
    weight: "100 gram",
    status: "PO",
    featured: false,
    views: 0
  },
  {
    id: 4,
    name: "Krupuk Udang Ronggeng",
    price: "Rp15.000",
    description: "Krupuk udang renyah dengan rasa khas yang digemari banyak orang.",
    image: "",
    category: "Produk PO",
    weight: "200 gram",
    status: "Tersedia",
    featured: false,
    views: 0
  },
  {
    id: 5,
    name: "Ikan Krispi",
    price: "Rp10.000",
    description: "Ikan crispy yang praktis dan cocok untuk camilan santai.",
    image: "",
    category: "Produk PO",
    weight: "150 gram",
    status: "Tersedia",
    featured: false,
    views: 0
  },
  {
    id: 6,
    name: "Intip Kriuk",
    price: "Rp5.000 / 100 gram",
    description: "Camilan renyah dengan tekstur kriuk yang pas untuk segala suasana.",
    image: "",
    category: "Produk PO",
    weight: "100 gram",
    status: "Habis",
    featured: false,
    views: 0
  },
  {
    id: 7,
    name: "Kembang Goyang",
    price: "Rp15.000 / 100 gram",
    description: "Camilan ringan dengan cita rasa unik dan menarik untuk dibagikan.",
    image: "",
    category: "Produk PO",
    weight: "100 gram",
    status: "Tersedia",
    featured: false,
    views: 0
  },
  {
    id: 8,
    name: "Aneka Ikan Asin",
    price: "Rp15.000 / 100 gram",
    description: "Pilihan bilis, dua waja, teri kapasan, japu, lemat, dan lainnya.",
    image: "",
    category: "Produk PO",
    weight: "100 gram",
    status: "PO",
    featured: false,
    views: 0
  }
];

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

function saveStorage(key, value) {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
    return seedProducts.map(normalizeProduct);
  }

  try {
    const parsed = JSON.parse(saved);
    return parsed.map(normalizeProduct);
  } catch (error) {
    console.error("Gagal membaca produk", error);
    return seedProducts.map(normalizeProduct);
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

function getWhatsAppClicks() {
  return Number(getStorage(WHATSAPP_CLICKS_KEY, 0));
}

function incrementWhatsAppClicks() {
  const clicks = getWhatsAppClicks() + 1;
  saveStorage(WHATSAPP_CLICKS_KEY, clicks);
  return clicks;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createPlaceholderImage(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
      <rect width="100%" height="100%" fill="#fdf2ea" />
      <circle cx="400" cy="220" r="140" fill="#ffd7be" />
      <rect x="220" y="310" width="360" height="80" rx="20" fill="#1f4b6d" />
      <text x="400" y="360" font-family="Segoe UI, sans-serif" font-size="28" fill="#ffffff" text-anchor="middle">${label}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function shadeColor(color, percent) {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function applySiteSettings() {
  const profile = getProfile();
  const socials = getSocials();
  const banner = getBanner();
  const settings = getSettings();

  document.title = settings.siteTitle || profile.businessName || "Jesin Food";
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', settings.seoDescription || profile.description || "Jesin Food");
  }

  const faviconLink = document.querySelector('link[rel="icon"]');
  if (settings.favicon && settings.favicon.trim()) {
    if (!faviconLink) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = settings.favicon;
      document.head.appendChild(link);
    } else {
      faviconLink.href = settings.favicon;
    }
  }

  const brand = document.getElementById('brand-name');
  if (brand) brand.textContent = profile.businessName || settings.siteTitle || "Jesin Food";

  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) heroTitle.textContent = banner.heroTitle || profile.businessName || "Jesin Food";

  const heroDescription = document.getElementById('hero-description');
  if (heroDescription) heroDescription.textContent = banner.heroDescription || profile.description || "Jesin Food";

  const promoTitle = document.getElementById('promo-title');
  if (promoTitle) promoTitle.textContent = banner.promoTitle || "Promo Spesial";

  const promoDescription = document.getElementById('promo-description');
  if (promoDescription) promoDescription.textContent = banner.promoText || "Temukan produk favorit yang cocok untuk oleh-oleh, camilan keluarga, dan pesanan rutin.";

  const promoButton = document.getElementById('promo-button');
  if (promoButton) promoButton.textContent = banner.promoButtonText || "Jelajahi Koleksi";

  const aboutDescription = document.getElementById('about-description');
  if (aboutDescription) aboutDescription.textContent = profile.description || "Jesin Food";

  const storyTitle = document.getElementById('story-title');
  if (storyTitle) storyTitle.textContent = `Cerita ${profile.businessName || "Jesin"}`;

  const storyDescription = document.getElementById('story-description');
  if (storyDescription) storyDescription.textContent = profile.story || "Keseruan brand kami terus tumbuh.";

  const storyList = document.getElementById('story-list');
  if (storyList) {
    storyList.innerHTML = `
      <li>${profile.vision || "Visi kami"}</li>
      <li>${profile.mission || "Misi kami"}</li>
      <li>${profile.address || "Alamat"}</li>
      <li>${profile.hours || "Jam operasional"}</li>
    `;
  }

  const footerBrand = document.getElementById('footer-brand');
  if (footerBrand) footerBrand.textContent = profile.businessName || settings.siteTitle || "Jesin Food";

  const footerDescription = document.getElementById('footer-description');
  if (footerDescription) footerDescription.textContent = profile.description || "Seafood dan makanan ringan berkualitas.";

  const whatsappLink = document.getElementById('social-whatsapp-link');
  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/${socials.whatsapp || '6281234567890'}`;
    whatsappLink.textContent = socials.whatsapp ? `WhatsApp: ${socials.whatsapp}` : 'WhatsApp';
  }

  const instagramLink = document.getElementById('social-instagram-link');
  if (instagramLink) {
    instagramLink.href = `https://www.instagram.com/${(socials.instagram || '@jesin.food').replace('@', '')}`;
    instagramLink.textContent = `Instagram: ${socials.instagram || '@jesin.food'}`;
  }

  const tiktokLink = document.getElementById('social-tiktok-link');
  if (tiktokLink) {
    tiktokLink.href = `https://www.tiktok.com/@${(socials.tiktok || '@jesin.food').replace('@', '')}`;
    tiktokLink.textContent = `TikTok: ${socials.tiktok || '@jesin.food'}`;
  }

  const facebookLink = document.getElementById('social-facebook-link');
  if (facebookLink) {
    facebookLink.href = `https://www.facebook.com/${(socials.facebook || 'JesinFood').replace(/\s+/g, '')}`;
    facebookLink.textContent = `Facebook: ${socials.facebook || 'Jesin Food'}`;
  }

  const mapsLink = document.getElementById('social-maps-link');
  if (mapsLink) {
    mapsLink.href = socials.mapsLink || 'https://maps.google.com';
    mapsLink.textContent = `Maps: ${profile.address || 'Alamat usaha'}`;
  }

  const hero = document.querySelector('.hero');
  if (hero) {
    const image = banner.heroImage || profile.heroImage || '';
    if (image) {
      hero.style.backgroundImage = `linear-gradient(120deg, rgba(17, 50, 77, 0.86), rgba(17, 50, 77, 0.36)), url('${image}')`;
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    } else {
      hero.style.backgroundImage = '';
    }
  }

  document.documentElement.style.setProperty('--primary', settings.themeColor || '#1f4b6d');
  document.documentElement.style.setProperty('--primary-dark', shadeColor(settings.themeColor || '#1f4b6d', -20));
}

function renderPublicCollections() {
  const galleryContainer = document.getElementById("gallery-collection");
  const testimonialContainer = document.getElementById("testimonial-collection");
  const faqContainer = document.getElementById("faq-collection");

  if (galleryContainer) {
    const galleryItems = getGallery();
    galleryContainer.innerHTML = galleryItems.length
      ? galleryItems.map((item) => `
          <div class="summary-item">
            ${item.type === "video" ? `<video controls src="${escapeHtml(item.url)}" style="width:100%;border-radius:12px"></video>` : `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title)}" style="width:100%;border-radius:12px;height:140px;object-fit:cover;margin-bottom:0.6rem" />`}
            <strong>${escapeHtml(item.title || "Item")}</strong>
          </div>
        `).join("")
      : '<div class="summary-item">Belum ada galeri yang dipublikasikan.</div>';
  }

  if (testimonialContainer) {
    const testimonials = getTestimonials();
    testimonialContainer.innerHTML = testimonials.length
      ? testimonials.map((item) => `
          <div class="summary-item">
            <strong>${escapeHtml(item.name || "Pelanggan")}</strong>
            <div>${escapeHtml(item.role || "")}</div>
            <div>⭐ ${escapeHtml(item.rating || 5)}/5</div>
            <p>${escapeHtml(item.comment || "")}</p>
          </div>
        `).join("")
      : '<div class="summary-item">Belum ada testimoni.</div>';
  }

  if (faqContainer) {
    const faqItems = getFaq();
    faqContainer.innerHTML = faqItems.length
      ? faqItems.map((item) => `
          <div class="summary-item">
            <strong>${escapeHtml(item.question || "FAQ")}</strong>
            <p>${escapeHtml(item.answer || "")}</p>
          </div>
        `).join("")
      : '<div class="summary-item">Belum ada FAQ.</div>';
  }
}

function renderProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  const products = getProducts();
  const updatedProducts = products.map((product) => ({ ...product, views: Number(product.views) || 0 }));
  saveProducts(updatedProducts);

  updatedProducts.forEach((product) => {
    product.views = Number(product.views) || 0;
  });

  const grouped = updatedProducts.reduce((result, product) => {
    if (!result[product.category]) result[product.category] = [];
    result[product.category].push(product);
    return result;
  }, {});

  productList.innerHTML = "";

  Object.entries(grouped).forEach(([category, items]) => {
    const section = document.createElement("div");
    section.innerHTML = `<h3 class="category-title">${category}</h3>`;
    const grid = document.createElement("div");
    grid.className = "product-grid";

    items.forEach((product) => {
      const badge = product.featured || product.status === "Unggulan" ? '<span class="hero-badge">Best Seller</span>' : '<span class="hero-badge">Produk</span>';
      const card = document.createElement("article");
      card.className = "product-card reveal";
      card.innerHTML = `
        <img src="${product.image || createPlaceholderImage(product.name)}" alt="${product.name}" />
        <div class="product-body">
          <div class="hero-tags">${badge}</div>
          <h3>${product.name}</h3>
          <p class="product-price">${product.price}</p>
          <p class="product-desc">${product.description}</p>
          <p class="product-desc"><strong>Berat:</strong> ${product.weight || "-"}</p>
          <p class="product-desc"><strong>Status:</strong> ${product.status || "Tersedia"}</p>
          <a class="btn btn-primary" href="https://wa.me/6281234567890?text=Halo%20Jesin%20Food%2C%20saya%20ingin%20memesan%20${encodeURIComponent(product.name)}" target="_blank" rel="noopener noreferrer">Pesan</a>
        </div>
      `;
      grid.appendChild(card);
    });

    section.appendChild(grid);
    productList.appendChild(section);
  });

  initReveal();
}

function trackWhatsAppClicks() {
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
    link.addEventListener('click', () => {
      incrementWhatsAppClicks();
    });
  });
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((element) => observer.observe(element));
}

function setupMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => links.classList.remove("open"));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  applySiteSettings();
  renderProducts();
  renderPublicCollections();
  setupMobileMenu();
  trackWhatsAppClicks();
  const initialSections = document.querySelectorAll('.reveal');
  initialSections.forEach((section) => section.classList.add('visible'));
});
