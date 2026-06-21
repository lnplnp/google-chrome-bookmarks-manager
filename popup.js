// =============================================
// CONFIGURATION
// =============================================
const ITEMS_PER_PAGE = 50; // Nombre d'éléments par page
let currentPage = 0;
let allDuplicates = []; // Tous les doublons trouvés
let filteredDuplicates = []; // Doublons filtrés
let isProcessing = false;

// =============================================
// ÉLÉMENTS DOM
// =============================================
const duplicatesTable = document.getElementById("duplicatesTable");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const searchInput = document.getElementById("search");
const duplicateCountEl = document.getElementById("duplicateCount");
const uniqueCountEl = document.getElementById("uniqueCount");

// =============================================
// FONCTIONS UTILITAIRES
// =============================================

/**
 * Formate une URL pour affichage (troncature si trop longue)
 */
function formatUrl(url, maxLength = 80) {
  try {
    const urlObj = new URL(url);
    // Affiche seulement le domaine + chemin (sans paramètres)
    let display = urlObj.hostname + urlObj.pathname;
    if (display.length > maxLength) {
      display = display.substring(0, maxLength) + "...";
    }
    return display;
  } catch {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  }
}

/**
 * Met à jour l'affichage de la table avec pagination
 */
function renderTable() {
  const startIdx = currentPage * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const pageItems = filteredDuplicates.slice(startIdx, endIdx);

  // Efface le contenu actuel
  duplicatesTable.innerHTML = "";

  if (pageItems.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML =
      '<td colspan="2" style="text-align: center; color: #999;">Aucun doublon trouvé</td>';
    duplicatesTable.appendChild(row);
    return;
  }

  // Ajoute les lignes pour cette page
  pageItems.forEach((item) => {
    const row = document.createElement("tr");

    // URL (avec titre si disponible)
    const urlCell = document.createElement("td");
    urlCell.textContent = formatUrl(item.url);
    urlCell.title = item.url; // Tooltip avec URL complète

    // Occurrences
    const countCell = document.createElement("td");
    countCell.textContent = item.count;
    countCell.style.textAlign = "center";

    row.appendChild(urlCell);
    row.appendChild(countCell);
    duplicatesTable.appendChild(row);
  });

  // Met à jour les boutons de pagination
  const totalPages = Math.ceil(filteredDuplicates.length / ITEMS_PER_PAGE) || 1;
  prevPageBtn.disabled = currentPage === 0;
  nextPageBtn.disabled = currentPage >= totalPages - 1;
  pageInfo.textContent = `Page ${currentPage + 1}/${totalPages}`;
}

/**
 * Filtre les doublons en fonction de la recherche
 */
function filterDuplicates() {
  const searchTerm = searchInput.value.toLowerCase();
  if (!searchTerm) {
    filteredDuplicates = [...allDuplicates];
  } else {
    filteredDuplicates = allDuplicates.filter((item) =>
      item.url.toLowerCase().includes(searchTerm),
    );
  }
  currentPage = 0; // Réinitialise à la première page
  renderTable();
}

// =============================================
// DÉTECTION DES DOUBLONS (OPTIMISÉE)
// =============================================

/**
 * Compte les occurrences de chaque URL de manière récursive
 * Utilise un Map pour éviter les doublons et compter efficacement
 */
function findDuplicates() {
  isProcessing = true;
  duplicatesTable.innerHTML =
    '<tr><td colspan="2" class="loading">Recherche des doublons en cours...</td></tr>';

  const urlCounts = new Map(); // URL -> { count, title, firstFolder }

  chrome.bookmarks.getTree(function (treeNodes) {
    // Fonction récursive pour parcourir l'arbre
    function traverse(node) {
      if (node.children) {
        // C'est un dossier, parcourir les enfants
        node.children.forEach(traverse);
      } else if (node.url) {
        // C'est un favori avec URL
        const normalizedUrl = node.url.trim();

        if (urlCounts.has(normalizedUrl)) {
          const entry = urlCounts.get(normalizedUrl);
          entry.count++;
          // Garder le premier titre trouvé
          if (!entry.title) entry.title = node.title;
        } else {
          urlCounts.set(normalizedUrl, {
            url: normalizedUrl,
            count: 1,
            title: node.title,
          });
        }
      }
    }

    // Parcourir tous les nœuds racine
    treeNodes.forEach(traverse);

    // Filtrer pour ne garder que les doublons (count > 1)
    allDuplicates = Array.from(urlCounts.values())
      .filter((item) => item.count > 1)
      .sort((a, b) => b.count - a.count); // Trier par nombre d'occurrences

    // Mettre à jour les stats
    document.getElementById("bookmarkCount").textContent =
      `Total: ${urlCounts.size}`;
    duplicateCountEl.textContent = `Doublons: ${allDuplicates.length}`;
    uniqueCountEl.textContent = `URLs uniques: ${urlCounts.size}`;

    // Initialiser le filtrage et la pagination
    filteredDuplicates = [...allDuplicates];
    currentPage = 0;
    renderTable();

    isProcessing = false;
  });
}

// =============================================
// ÉVÉNEMENTS
// =============================================

// Chargement initial
document.addEventListener("DOMContentLoaded", findDuplicates);

// Pagination
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderTable();
  }
});

nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredDuplicates.length / ITEMS_PER_PAGE);
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderTable();
  }
});

// Recherche avec debounce pour éviter les requêtes trop fréquentes
let searchTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(filterDuplicates, 300); // 300ms de délai
});
