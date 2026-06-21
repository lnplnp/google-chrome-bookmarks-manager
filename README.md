# Google Chrome Bookmarks Manager

Extension Chrome pour détecter et gérer les doublons dans vos favoris.

## Motivation

Après avoir importé plusieurs fois les favoris des différents navigateurs, il est courant de se retrouver avec beaucoup de doublons. Cette extension aide à les identifier et à les nettoyer.

## Fonctionnalités

- **Détection automatique des doublons** : Scanne tous vos favoris et identifie les URLs en doublon
- **Affichage des résultats** : Interface interactive montrant les doublons détectés
- **Recherche et filtrage** : Filtrez rapidement les doublons par mots-clés
- **Pagination** : Naviguez facilement parmi les résultats (50 éléments par page)
- **Statistiques** : Visualisez le nombre de doublons et d'URLs uniques

## Installation

1. Clonez ou téléchargez ce dépôt
2. Ouvrez Chrome et allez sur `chrome://extensions/`
3. Activez le **Mode développeur** (coin supérieur droit)
4. Cliquez sur **Charger l'extension non empaquetée**
5. Sélectionnez le dossier du projet

## Utilisation

1. Cliquez sur l'icône de l'extension en haut à droite de Chrome
2. Attendez que la scan des favoris se termine
3. Explorez les doublons détectés avec les statistiques
4. Utilisez la recherche pour filtrer les résultats
5. Naviguez dans les pages de résultats

## Architecture technique

- **manifest.json** : Configuration de l'extension (Manifest V3)
- **popup.html** : Interface utilisateur
- **popup.js** : Logique de détection des doublons et gestion des favoris

## Permissions

L'extension demande la permission `bookmarks` pour :
- Lire l'arborescence des favoris et détecter les doublons

## Version

- **v0.4** - Détection et gestion des doublons avec interface interactive
