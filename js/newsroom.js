document.addEventListener('DOMContentLoaded', function() {
    const articles = document.querySelectorAll('.news-article');
    const articlesPerPage = 5; // Show 5 articles at a time
    let currentArticle = articlesPerPage;

    // Hide all articles except first batch
    articles.forEach((article, index) => {
        if (index >= articlesPerPage) {
            article.style.display = 'none';
        }
    });

    // Load more articles when scrolling
    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            // Show next batch of articles
            for(let i = currentArticle; i < currentArticle + articlesPerPage; i++) {
                if (articles[i]) {
                    articles[i].style.display = 'block';
                }
            }
            currentArticle += articlesPerPage;
        }
    });
});