/*
 * Purpose: This file receives image data from the skeleton code and converts
 * it from morse code to plain text
 * Organization/Team: Team 013
 * Authors: Unas Arshad, Anita Karapanos, Roman Lisnyak, Jeren Velletri
 * Last Modified: 09/04/16 
 * Due 10/04/16
 */



//This is the lookup table where all the morse code signals are 
//listed next to their character equivalents.
var morseCodeToCharacterTable = {
    //letters
    ".-": "a",
    "-...": "b",
    "-.-.": "c",
    "-..": "d",
    ".": "e",
    "..-.": "f",
    "--.": "g",
    "....": "h",
    "..": "i",
    ".---": "j",
    "-.-": "k",
    ".-..": "l",
    "--": "m",
    "-.": "n",
    "---": "o",
    ".--.": "p",
    "--.-": "q",
    ".-.": "r",
    "...": "s",
    "-": "t",
    "..-": "u",
    "...-": "v",
    ".--": "w",
    "-..-": "x",
    "-.--": "y",
    "--..": "z",
    //numbers
    "-----": "0",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    //symbols
    //some of the symbols below have backslashes added as escape characters
    "-.--.": "(",
    "-.--.-": ")",
    ".-..-.": "\"",
    "-...-": "=",
    ".----.": "\'",
    "-..-.": "/",
    ".-.-." : "+",
    "---...": ":",
    ".-.-.-": ".",
    "--..--": ",",
    "..--..": "?",
    "-....-": "-",
    ".--.-.": "@",
    '...-..-': "$",
    '..--.-': "_",
    "-.-.--": "!",
    //new line 
    ".-.-": "&#013&#010"
};

var outputBox = document.getElementById("messageField");
var output = "";
var currentCharacter = "";
var onCount = 0, offCount = 0;

//function that resets the necessary variables and clears the output box
restartButton.onclick=function()
{
	var outputBox = document.getElementById("messageField");
	outputBox.innerHTML = "";
    output = "";
    currentCharacter = "";
    onCount = 0, offCount = 0;

};

/*
 * This function is called once per unit of time with an array of camera image data.
 * It loops through the array and finds the sum of all the red, green and blue values, 
 * then finds the average red and blue and green value of each pixel in the array.
 * 
 * To ensure that the image is either red or blue and not green or white with 
 * marginally more red or blue, the values are first checked to make sure 
 * that the image is either more red or more blue than it is green,
 * then checked to make sure the difference between the red and blue values is
 * significant.
 * The average red and blue values are then passed as arguments to the countStates
 * function, which determines whether the image is mostly red or blue and 
 * returns True for red and False for blue
 *
 * the function also checks for the end of transmission signal, 
 * and executes the messageFinished() function
 */
function decodeCameraImage(data)
{
	//checks to see if message is finished
    if (currentCharacter ==  "...-.-")
    {
        messageFinished();
    }
    var averageRedValue = 0, averageBlueValue = 0, averageGreenValue = 0;
    var totalRedValue = 0, totalBlueValue = 0, totalGreenValue = 0;
    // Each for loop finds the sum of the red and blue values in the array
    // It loops until the counter reaches the end of the array
    // Each for loop also contains a check to ensure that only numbers are added to the total
    for (var i = 0; i <= data.length; i = i+4)
    {
        if (isNaN(data[i]) == false)
        {
            totalRedValue = totalRedValue + data[i];
        }      
    }

    for (var j = 2; j <= data.length; j = j+4)
    {
        if (isNaN(data[j]) == false)
        {
            totalBlueValue = totalBlueValue + data[j];
        }      

    }
    
    for (var k = 1; k <= data.length; k = k+4)
    {
        if (isNaN(data[i]) == false)
        {
            totalGreenValue = totalGreenValue + data[i];
        }      
    }
    // The average colour value for each pixel is found by dividing the sum 
    // of each colour by the number of values of each colour in the array 
    averageRedValue = totalRedValue/(data.length/4);
    averageBlueValue = totalBlueValue/(data.length/4);
    averageGreenValue = totalGreenValue/(data.length/4)
    // first checks that the image is either more red or more blue than it is green
	// then checks that the difference between red and blue is greater than 5
	if (averageRedValue > averageGreenValue || averageBlueValue > averageGreenValue)
    {
        if (Math.abs(averageRedValue - averageBlueValue) > 5 )
        {
            return countStates(averageRedValue,averageBlueValue);
        }
        
    }
    
}

/*
 * Function countStates is called by the decodeCameraImage function which passes the average 
 * red and blue values of each pixel.
 * It the determines if the image is either more blue or red, then checks whether
 * there has been a change of state. If a change of state has occurred it
 * executes the timeUnitToState function, passing the number of consecutive occurrences
 * of the previous state, as well as the value of the previous state (true/false) 
 * 
 * Regardless of whether a change of state has occurred, the counter for the current state
 * is incremented, and the counter for the other state is reset
 * 
 */
function countStates(redValue, blueValue)    
{    
    if (redValue > blueValue)
    {
        // this detects a change of state, as if onCount is zero, it has not yet been incremented
        if (onCount == 0)
        {
            timeUnitToState(offCount, false);
        }
        // Resets the offCount and increments the onCount
        offCount = 0;
        onCount++;
        return true
    }
    else
    {
        if (offCount == 0)
        {
            timeUnitToState(onCount,true);
        }
        onCount  = 0;
        offCount++;
        return false
    }

}

/*
 * This function is passed two arguments; timeunit, and state.
 * it then checks whether the timeunit falls within any of the defined ranges
 * for the given state, and if so performs the correct operation; either
 * adding a morse signal to the current character being transmitted, or outputting the current
 * character to the page
 */
function timeUnitToState(timeUnit,state)
{
    
    
    //true state signifies a red signal (either a dot or a dash)
    if(state == true)
    {
        if (timeUnit >= 1 && timeUnit <= 2)
        {
            currentCharacter += ".";
        }
        else if (timeUnit >= 3)
        {
            currentCharacter += "-";
        }

    }
    else if(state == false)
    {
        if(timeUnit >=0 && timeUnit <= 2)
        {
            currentCharacter += "";
        }
        else if (timeUnit >= 3 && timeUnit <= 6)
        {
          
            //this ensures that the current character can be translated from morse code
            if (typeof morseCodeToCharacterTable[currentCharacter] !== 'undefined') 
            {
                output+= morseCodeToCharacterTable[currentCharacter]
            }
            //sets the message box to display the output string, and resets the current character
            outputBox.innerHTML = output;
            currentCharacter = "";

        }
        else if (timeUnit >= 7)
        {
           
            if (typeof morseCodeToCharacterTable[currentCharacter] !== 'undefined') 
            {
                //outputs both the previous character and a space
                output+= morseCodeToCharacterTable[currentCharacter] + " ";
            }
            outputBox.innerHTML = output;
            currentCharacter = "";
        }
    }
}










