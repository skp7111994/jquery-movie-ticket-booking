// import * as $ from 'jquery';
import { currentMovies, upcomingMovies } from '../mock-data/data.json';
import * as $ from '../jquery.min';

$(() => {
    const main = $('#main');
    const bookedTickets = {};
    let ticketCount = 0;
    const logo = $('.logo');

    logo.on('click', () => {
        window.location.reload();
    });

    const occupyRandomly = () => {
        return Math.ceil(Math.random() * 10) % 2 === 0 ? 'occupied' : '';
    }

    const proceedToPayment = () => {

    }

    const selectTickets = (e) => {
        const seatNum = $(e.target).attr('data-seat');
        const checkoutSection = $('.checkout-section');
        if (!bookedTickets[seatNum]) {
            bookedTickets[seatNum] = true;
            ticketCount++;
        } else {
            delete bookedTickets[seatNum];
            ticketCount--;
        }
        if (ticketCount > 0) {
            checkoutSection.removeClass('hide');
        } else {
            checkoutSection.addClass('hide');
        }
    }

    const seatSelection = (movie, showTime) => {
        main.empty();
        const ticketSection = $('<section>', { class: 'ticket-section' });
        const screenSection = $('<section>', { class: 'screen-section' });
        const checkoutBtn = $('<button>', { text: 'Checkout', class: 'btn'});
        const checkoutSection = $('<section>', { class: 'checkout-section hide' }).append(checkoutBtn)
        const screen = $('<section>', { class: 'screen' });
        const screenText = $('<article>', { text: 'Eyes this way!' });
        screenSection.append(screen, screenText);
        const showcase = $('<ul>', { class: 'showcase' });
        const seatNA = $('<li>').append($('<div>', { class: 'seat' })).append($('<small>', { text: 'Available' }));
        const seatSelected = $('<li>').append($('<div>', { class: 'seat selected' })).append($('<small>', { text: 'Selected' }));
        const seatOccupied = $('<li>').append($('<div>', { class: 'seat occupied' })).append($('<small>', { text: 'Occupied' }));
        // Max value should be 26 (A-Z)
        const TOTAL_ROWS = 26;
        const TOTAL_COLUMNS = 20;
        Array(TOTAL_ROWS).fill(0).forEach((_, row) => {
            const rowEl = $('<section>', { class: 'seat-row' });
            Array(TOTAL_COLUMNS).fill(0).forEach((_, col) => {
                const seatNum = `${String.fromCharCode(row + 65)}${col + 1}`;
                const seatEl = $('<section>', { class: `seat ${occupyRandomly()}` }).attr('data-seat', `${seatNum}`);
                if (!seatEl.hasClass('occupied')) {
                    seatEl.attr('title', seatNum)
                }
                rowEl.append(seatEl);
            });
            ticketSection.append(rowEl);
        });

        $(ticketSection).click(function (e) {
            if ($(e.target).hasClass('seat') && !$(e.target).hasClass('occupied')) {
                $(e.target).toggleClass('selected');
                selectTickets(e);
            }
        });
        showcase.append(seatNA, seatSelected, seatOccupied);
        main.append(showcase, ticketSection, screenSection, checkoutSection);
    }
    const bookTickets = (movieId) => {
        main.empty();
        const sectionHeader = $('<h4>', { text: 'Now running at:', class: 'book-tickets-section-header' });
        const theatreSection = $('<section>').append(sectionHeader);
        const movie = currentMovies.data[movieId - 1];
        const { nowRunningAt } = movie;
        nowRunningAt.forEach(({ name, location, showTimes }) => {
            const theatreEl = $('<section>');
            const theatreNameEl = $('<h5>');
            const locationEl = $('<h6>');
            const showTimesEl = $('<section>', { class: 'showtimes-section' });
            theatreNameEl.text(name);
            locationEl.text(location);
            showTimes.forEach(showTime => {
                const time = $('<time>');
                time.text(showTime);
                time.on('click', () => seatSelection(movie, showTime));
                showTimesEl.append(time);
            })
            theatreEl.append(theatreNameEl, locationEl, showTimesEl);
            theatreSection.append(theatreEl);
        });
        main.append(theatreSection);
    };
    const generateMovie = (movie, notClickable) => {
        const movieSection = $('<section>');
        const movieDetails = $('<section>');
        const movieInfo = $('<section>').addClass('movie-info');
        const poster = $('<img>');
        const title = $('<h4>');
        const description = $('<div>');
        const castSection = $('<section>');
        const reviewsSection = $('<section>', {class: 'd-flex'});
        const bookTicketsBtn = $('<button>', {class: 'btn book-tickets-btn'});
        const language = $('<div>', {
            text: movie.language
        }).addClass('badge bg-secondary')
        poster.attr('src', movie.poster);
        poster.attr('alt', movie.name);
        title.text(`${movie.name}(${movie.rating})`);
        description.text(movie.description);
        movie.cast.forEach(person => {
            const castDetails = $('<section>');
            const name = $('<h5>');
            const role = $('<h6>');
            const img = $('<img>');
            name.text(person.name);
            role.text(`(As ${person.role})`);
            img.attr('src', person.image);
            castDetails.append(img, name, role, castDetails);
            castSection.append(castDetails);
        });
        const reviewHeadingEl = $('<h4>', {text: 'Reviews'});
        movie.reviews.forEach(({title, description, user, rating}) => {
            const reviewEl = $('<section>', {class: 'review-card'});
            const titleEl = $('<h6>', {text: title, class: 'text-align-center'});
            const descriptionEl = $('<p>', {text: description, class: 'review-description'});
            const userEl = $('<div>', {text: user, class: 'review-user'});
            const ratingEl = $('<p>', {text: `★`.repeat(Number(rating)), class: 'star-enabled text-align-center'});
            reviewEl.append(titleEl, ratingEl, descriptionEl, userEl);
            reviewsSection.append(reviewEl);
        })
        bookTicketsBtn.text('Book Tickets');
        bookTicketsBtn.on('click', () => bookTickets(movie.id));
        movieDetails.addClass('movie-details');
        castSection.addClass('cast-section');
        movieInfo.append(title, language, description, bookTicketsBtn);
        movieDetails.append(poster, movieInfo);
        movieSection.append(movieDetails, castSection,reviewHeadingEl, reviewsSection);
        if (notClickable) {
            bookTicketsBtn.addClass('hide');
            reviewHeadingEl.addClass('hide');
            reviewsSection.addClass('hide');
        }
        main.append(movieSection);
    };
    const navigateToMoviePage = (data, movieId, notClickable) => {
        main.empty();
        generateMovie(data[movieId - 1], notClickable);
    }
    const nowPlaying = $('#now-playing');
    const upcoming = $('#upcoming-movies');
    const appendMovieList = (data, el, notClickable) => {
        let type = 'nowPlaying';
        if(notClickable) {
            type = 'upcoming';
        }
        const slider = $(`<div>`);
        slider.addClass(`_slider ${type}`);
        const next = $('<a>', {text : '❯'});
        next.attr('href', '#');
        next.addClass(`_slider_next ${type}`);
        const prev = $('<a>', {text : '❮'});
        prev.attr('href', '#');
        prev.addClass(`_slider_prev ${type}`);
        let ul = $('<ul>');
        $(data).each(function (_, { poster, name, genre, id }) {      
            const li = $('<li>');     
            const movieCard = $(`<div>`)
            movieCard.addClass('card movie-card-width router-el');
            movieCard.attr('data-location', 'movie');
            const img = $('<img>');
            img.attr('src', poster);
            img.attr('alt', name);
            img.addClass('card-img-top');
            const movieDetails = $('<div>');
            movieDetails.addClass('movie-info')
            const movieTitle = $('<h5>');
            movieTitle.addClass('card-title');
            movieTitle.text(name);
            const genreEl = $('<p>');
            genreEl.addClass('card-text');
            genreEl.text(genre.join('/'));
            movieDetails.append(movieTitle, genreEl);
            movieCard.append(img, movieDetails);
            movieCard.on('click', () => navigateToMoviePage(data, id, notClickable));
            movieCard.addClass('cursor-pointer');
            li.append(movieCard)
            ul.append(li);
        });
        slider.append(next, prev, ul);        
        $(el[0]).append(slider);
    }
    appendMovieList(currentMovies.data, nowPlaying);
    appendMovieList(upcomingMovies.data, upcoming, true);


    
});

$(document).ready( ($) => {
    var slideCount = $('._slider ul li').length;
	var slideWidth = $('._slider ul li').width();
	var slideHeight = $('._slider ul li').height();

    slideWidth = '100%';
    slideHeight = '500px';
	var sliderUlWidth = slideCount * slideWidth;
	
	$('._slider.nowPlaying').css({ width: slideWidth, height: slideHeight });	
	$('._slider.nowPlaying ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });

    $('._slider.upcoming').css({ width: slideWidth, height: slideHeight });	
	$('._slider.upcoming ul').css({ width: sliderUlWidth, marginLeft: - slideWidth });
	
    $('._slider.nowPlaying ul li:last-child').prependTo('._slider.nowPlaying ul');
    $('._slider.upcoming ul li:last-child').prependTo('._slider.upcoming ul');
  
      function moveLeft(type) {
          $(`._slider.${type} ul`).animate({
              left: '100px'
          }, 200, function () {
              $(`._slider.${type} ul li:last-child`).prependTo(`._slider.${type} ul`);
              $(`._slider.${type} ul`).css('left', '');
          });
      };
  
      function moveRight(type) {
          $(`._slider.${type} ul`).animate({
              left: '-100px'
          }, 200, function () {
              $(`._slider.${type} ul li:first-child`).appendTo(`._slider.${type} ul`);
              $(`._slider.${type} ul`).css('left', '');
          });
      };
  
      $('._slider_prev.nowPlaying').click(function () {
          moveLeft('nowPlaying');
          return false;
      });
  
      $('._slider_next.nowPlaying').click(function () {
          moveRight('nowPlaying');
          return false;
      });

      $('._slider_prev.upcoming').click(function () {
        moveLeft('upcoming');
        return false;
    });

    $('._slider_next.upcoming').click(function () {
        moveRight('upcoming');
        return false;
    });
  
  });  