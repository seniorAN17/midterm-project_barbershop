// Used on both pages. jQuery effect: smooth scroll.
// A link with the class "scroll-link" moves the page smoothly to its section.
$(".scroll-link").on("click", function (event) {
  event.preventDefault();
  const target = $(this).attr("href");   // for example "#booking"
  // stop(true) cancels the old scroll, so fast repeated clicks do not break it
  $("html, body").stop(true).animate({ scrollTop: $(target).offset().top }, 600);
});
