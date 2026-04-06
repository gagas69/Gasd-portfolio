document.addEventListener('DOMContentLoaded', () => {
    const books = document.querySelectorAll('.book-container');

    books.forEach(book => {
        book.addEventListener('click', (e) => {
            // Empêcher la propagation si on clique sur le bouton "Voir le projet"
            if (e.target.classList.contains('view-project-btn')) {
                // Ici, on pourrait faire une vraie redirection (ex: window.location.href = "projet.html")
                return;
            }

            // Si le livre est DÉJÀ ouvert
            if (book.classList.contains('is-open')) {
                // On pourrait le refermer complétement
                book.classList.remove('is-open');
                book.classList.remove('is-active');
                return;
            }

            // Si le livre est DÉJÀ actif (de face), on l'ouvre
            if (book.classList.contains('is-active')) {
                book.classList.add('is-open');
                return;
            }

            // Sinon (il est en tranche), on le rend actif
            // 1. Fermer et désactiver tous les autres
            books.forEach(otherBook => {
                otherBook.classList.remove('is-active', 'is-open');
            });

            // 2. Activer celui-ci
            book.classList.add('is-active');
        });
    });

    // Optionnel : fermer le livre si on clique dans le vide
    document.querySelector('.bookshelf-container').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            books.forEach(book => {
                book.classList.remove('is-active', 'is-open');
            });
        }
    });
});
