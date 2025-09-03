# Awtrix3 Notifier

Application web **mobile-first** pour envoyer des notifications personnalisées à une horloge Ulanzi Awtrix3 via l’API REST.

## 🔥 Fonctionnalités

- **Envoi de notifications** visuelles avec message, couleur, icône, son, effet et répétition.
- **Sélection facile** du son (bip simple ou mélodies populaires : Super Mario, Harry Potter, Star Wars…).
- **Gestion des icônes** par numéro, compatible avec les fichiers présents sur l’horloge.
- **Effets d’affichage** paramétrables : Matrix, Slide, Fade, Rainbow…
- **Historique** des notifications : réutilisez ou supprimez vos messages préférés.
- **Réglage IP** automatique et test du réseau, suggestions VPN si horloge inaccessible.


## 📲 Aperçu

## 🚀 Installation

1. Téléchargez le dépôt ou clonez-le :

```bash
git clone https://github.com/votre-utilisateur/awtrix-notifier.git
```

2. Déposez les fichiers sur un serveur web, ou ouvrez simplement `index.html` dans votre navigateur mobile ou desktop.
3. Configurez l’IP de votre horloge dans l’onglet Réglages.

## 🛠️ Technologies

- **HTML5 / CSS3 (mobile first / responsive)**
- **JavaScript** (app.js, localStorage pour historique)
- **Awtrix3 API REST** (POST `/api/notify`)


## 🎶 Mélodies supportées (ajoutez ces fichiers RTTTL dans le dossier MELODIES) :

- SuperMarioTheme
- SuperMarioLost
- HarryPotter
- StarWars
- Bip simple


## 📦 Utilisation

1. **Configurez l’IP** : Menu Réglages > renseignez l’adresse locale ou VPN de votre Awtrix3.
2. **Composez votre notification** : Saisissez le message, choisissez couleur, son, icône, effet, répétition.
3. **Envoyez !** L’application communique avec l’horloge sur le réseau local ou via VPN (WireGuard recommandé hors réseau).
4. **Retrouvez vos messages favoris** dans l’Historique pour les rejouer en un clic.

## 🛡️ Sécurité \& Réseau

- Si l’app ne détecte pas l’horloge : vérifiez le WiFi ou connectez-vous via VPN WireGuard.
- Les notifications restent privées sur votre appareil grâce à la sauvegarde locale.


## ✨ Personnalisation

- Ajoutez vos propres icônes dans le répertoire ICONS de l’horloge (format GIF/JPG).
- Modifiez et enrichissez la liste des sons et effets via le code source (data_json dans app.js).


## 📖 Documentation

- [Documentation Awtrix3](https://blueforcer.github.io/awtrix3/#/api)
- Exemples de payload :

```json
{
  "text": "Votre message",
  "color": "FF6600",
  "sound": "HarryPotter",
  "icon": "12795",
  "effect": "Matrix",
  "repeat": 2
}
```


## 💡 Contributions

- Les demandes de fonctionnalités, corrections de bugs et suggestions sont les bienvenues !
- Ouvrez une « issue » ou une pull request.


## ⭐ Remerciements

- Merci à la communauté Awtrix, Arduino et Ulanzi pour leur documentation et idées de mélodies.
- Icônes et mélodies : voir notre [capture d’écran](screenshots/awtrix-icons.png).
