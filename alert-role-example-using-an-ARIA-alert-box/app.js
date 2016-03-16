$(document).ready(function () { 
  var guess1 = new guess(1, 10, 'guess1_text', 'guess1_check', 'guess1_again', 'guess1_alert'); 
}); 

// 
// guess() is a class to implement a simple number guessing game 
// 
// @param (max integer) min is the maximum number to guess. 
// 
// @param (text_id string) text_id is the id of the text box where player enters a guess. 
// 
// @param (check_id string) check_id is the id of the check guess button. 
// 
// @param (again_id string) again_id is the id of the play again button. 
// 
// @param (alert_id string) alert_id is the id of the alert element where game messages will 
//                          be printed. 
// 
// @return N/A 
// 
function guess(min, max, text_id, check_id, again_id, alert_id) { 
   
  // define class properties 
  this.minGuess = min;         // the minimum number to guess 
  this.maxGuess = max;         // the maximum number to guess 
  this.$text = $('#' + text_id);   // the jQuery object pointer to the text box 
  this.$check = $('#' + check_id); // the jQuery object pointer to the check guess button 
  this.$again = $('#' + again_id); // the jQuery object pointer to the play again button 
  this.$alert = $('#' + alert_id); // the jQuery object pointer to the alert area 

  this.guessVal = -1;        // the number for the player to guess 
  this.guessCount = 0;       // the number of attempts the player has made 

  this.enterKey = 13;        // key code for the enter key 

  // bind event handlers 
  this.bindHandlers(); 

  // initialize the game 
  this.newGame(); 

} // end guess object constructor 

// 
// newGame() is a member function to set up a new game. The function chooses a number 
// between 1 and the max number specified at instantiation, sets the guess count to 0, and 
// show the user a message to make a guess. 
// 
// @return N/A 
guess.prototype.newGame = function () { 

  // get a new random number for the player to guess 
  this.guessVal = Math.floor(Math.random()*(this.maxGuess - this.minGuess + 1)) + this.minGuess; 
   
  // reset the guess count 
  this.guessCount = 0; 

  // reset the guess text box 
  this.$text.val(''); 
  this.$text.attr('aria-invalid', 'false'); 

  // Re-enable the buttons 
  this.$text.removeAttr('disabled'); 
  this.$check.removeAttr('disabled'); 

  // invite the user to make a guess 
  this.$alert.text('Make a guess.'); 

  // set focus on the guest text box 
  this.$text.focus(); 

} // end newGame 

// 
// bindHandlers() is a function to bind the event handlers for the game controls 
// 
// @return N/A 
// 
guess.prototype.bindHandlers = function () { 

  var thisObj = this; // Store the this pointer 

  // bind a focus handler for the guess text box 
  this.$text.focus(function (e) { 
    thisObj.handleTextFocus(e); 
    return true; 
  }); 

  // bind a keydown handler for the guess text box 
  this.$text.keydown(function (e) { 
    return thisObj.handleTextKeyDown(e); 
  }); 

  // bind a keypress handler for the guess text box 
  this.$text.keypress(function (e) { 
    return thisObj.handleTextKeyPress(e); 
  }); 

  // bind a click handler for the check guess button 
  this.$check.click(function (e) { 
    return thisObj.handleCheckClick(e); 
  }); 

  // bind a click handler for the play again button 
  this.$again.click(function (e) { 
    return thisObj.handleAgainClick(e); 
  }); 

} // end bindHandlers() 

// 
// handleTextFocus() is a member function to process focus events for the guess text box 
// 
// @input (evt obj) evt is the event object associated with the keydown event 
// 
// @return N/A 
// 
guess.prototype.handleTextFocus = function(evt) { 

  // Select any text in the text box 
  this.$text.select(); 

} // end handleTextFocus() 

// 
// handleTextKeyDown() is a member function to process keydown events for the guess text box 
// 
// @input (evt obj) evt is the event object associated with the keydown event 
// 
// @return (boolean) false if consuming event, true if propagating 
// 
guess.prototype.handleTextKeyDown = function(evt) { 

  // do nothing if shift, alt, or ctrl key pressed. 
  if (evt.shiftKey || evt.altKey || evt.ctrlKey) { 
    return true; 
  } 

  if (evt.keyCode == this.enterKey) { 

    // validate the guess 
    if (this.validateGuess() == true) { 

      // increment the guess count 
      this.guessCount++; 

      // see if the player has won 
      if (this.checkGuess() == true) { 
        // disable the guess text box and the check guess button 
        this.$text.attr('disabled', 'true'); 
        this.$check.attr('disabled', 'true'); 

        // Set the focus on the play again button 
        this.$again.focus(); 
      } 
      else { 
        // Game is still in progress. Set focus on the guess text box 
        this.$text.focus(); 
      } 
    } 
    else { 
      // not a valid guess 
      this.$text.focus(); 
    } 

    evt.stopPropagation; 
    return false; 
  } 

  return true; 

} // end handleTextKeyDown() 

// 
// handleTextKeyPress() is a member function to process keypress events for the guess text box. This function 
// is included to handle browsers that perform window scrolling, etc. on keypress rather than keydown. 
// 
// @input (evt obj) evt is the event object associated with the keypress event 
// 
// @return (boolean) false if consuming event, true if propagating 
// 
guess.prototype.handleTextKeyPress = function(evt) { 

  // do nothing if shift, alt, or ctrl key pressed. 
  if (evt.shiftKey || evt.altKey || evt.ctrlKey) { 
    return true; 
  } 

  if (evt.keyCode == this.enterKey) { 

    // consume the event 
    evt.stopPropagation; 
    return false; 
  } 

  return true; 

} // end handleTextKeyPress() 

// 
// handleCheckClick() is a member function to process click events for the check guess button 
// 
// @input (evt obj) evt is the event object associated with the click event 
// 
// @return (boolean) false if consuming event, true if propagating 
// 
guess.prototype.handleCheckClick = function(evt) { 

  // do nothing if shift, alt, or ctrl key pressed. 
  if (evt.shiftKey || evt.altKey || evt.ctrlKey) { 
    return true; 
  } 

  // validate the guess 
  if (this.validateGuess() == true) { 

    // increment the guess count 
    this.guessCount++; 

    // see if the player has won 
    if (this.checkGuess() == true) { 
      // disable the guess text box and the check guess button 
      this.$text.attr('disabled', 'true'); 
      this.$check.attr('disabled', 'true'); 

      // Set the focus on the play again button 
      this.$again.focus(); 
    } 
    else { 
      // Game is still in progress. Set focus on the guess text box 
      this.$text.focus(); 
    } 
  } 
  else { 
    // not a valid guess 
    this.$text.focus(); 
  } 
     
  evt.stopPropagation; 
  return false; 

} // end handleCheckClick() 

// 
// handleAgainClick() is a member function to process click events for the play again button 
// 
// @input (evt obj) evt is the event object associated with the click event 
// 
// @return (boolean) false if consuming event, true if propagating 
// 
guess.prototype.handleAgainClick = function(evt) { 

  // do nothing if shift, alt, or ctrl key pressed. 
  if (evt.shiftKey || evt.altKey || evt.ctrlKey) { 
    return true; 
  } 

  // Setup a new game 
  this.newGame(); 

  // Set focus to the guess text box 
  this.$text.focus(); 
     
  evt.stopPropagation; 
  return false; 

} // end handleTextKeyDown() 

// 
// validateGuess() is a member function to validate a player's guess. If the guess is not a number, is less than 
// the minimum allowed guess, or is greater than the maximum allowed guess, the user is warned that the guess is invalid 
// 
// @return (boolean) true if guess is valid; false if guess is invalid 
// 
guess.prototype.validateGuess = function() { 
  var val = this.$text.val(); 

  if (this.$text.val() == '') { 
    // guess is empty 
    this.$text.attr('aria-invalid', 'true'); 
    this.$alert.html('You must enter a number!'); 

    return false; 
  } 
  else if (isNaN(val) == true) { 

    // guess is not a number 
    this.$text.attr('aria-invalid', 'true'); 
    this.$alert.html('\'' + this.$text.val() + '\' is not a number!'); 

    return false; 
  } 
  else if (val < this.minGuess || val > this.maxGuess) { 

    // guess is out of range 
    this.$text.attr('aria-invalid', 'true'); 
    this.$alert.html('You must choose a number between ' + this.minGuess + ' and ' + this.maxGuess + '!'); 

    return false; 
  } 
   
  this.$text.attr('aria-invalid', 'false'); 

  return true; 

} // end validateGuess() 

// 
// checkGuess() is a member function to check the player's guess to see if he or she has won the game 
// 
// @return (boolean) true if the player has won; false if not 
guess.prototype.checkGuess = function() { 

  var guess = this.$text.val(); 

  if (guess == this.guessVal) { 

    // The player has won. Tell the player how many tries it took 

    if (this.guessCount == 1) { 
      this.$alert.html('\'' + guess + '\' is right. You got it on your first try!'); 
    } 
    else { 
      this.$alert.html('\'' + guess + '\' is right. It only took you ' + this.guessCount + ' tries!'); 
    } 
    return true; 
  } 

  // Player did not guess the correct number. Tell the player if he or she is too high or too low 
  if (guess < this.guessVal) { 
    this.$alert.html('\'' + guess + '\' is too low. Try a higher number.'); 
  } 
  else { 
    this.$alert.html('\'' + guess + '\' is too high. Try a lower number.'); 
  } 

  return false; 

} // end checkGuess() 
