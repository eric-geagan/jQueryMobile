let list = []
class Show {
  constructor(pname, ptype, pstatus, prating, pURL) {
    this.name = pname
    this.type = ptype
    this.status = pstatus
    this.rating = prating
    this.URL = pURL
  }

  getAll() {
    return this.type + ': "' + this.name + '", ' + 'Current Status: '+ this.status +  ', Rating: ' + this.rating
  }
}

$(document).on("pagebeforeshow","#list",function() {
  showEntries()
});

$(document).on('pagebeforeshow','#stats',function() {
  showValues()
})

function formSubmitEvent() {
  // Get name of movie and rating
  let showName = $('#showName').val();
  let type = $('#type').val();
  let status = $('#status').val();
  let rating = $('#rating').val();
  let url = $('#url').val();
  let show = new Show(showName, type, status, parseInt(rating), url)
  // Validate the object values?
  let result = true
  if (result) {
    // Add object to list
    list.push(show)
    
    // Set fields to blank string
  $('#showName').val('');
  $('#url').val('');
  } else {
    // Alert of bad values
    alert("Please fill in the fields with a valid entry.")
  }
}

function showEntries() {
  let parent = $('#listId')
  parent.empty() // Removes all existing child elements
  // Adds all list elements to display
  list.forEach(item => {
    let text = item.getAll()
    // Check if a url was entered
    if (item.URL === '') {
      // Default to imdb search
      const searchItem = item.name.replace(/\s/g, '+')
      item.URL = 'https://www.imdb.com/find?q=' + searchItem + '&ref_=nv_sr_sm'
    }
    let newElement = document.createElement('li')
    newElement.addEventListener('click', 
      function (event) {
        event.preventDefault()
        if (confirm('You are about to open a new window. Please confirm.')) {
          window.open(item.URL)
        }
      },
      false)
    newElement.innerHTML = text
    // Add it to the unordered list
    parent.append(newElement);
  })
}

function showValues() {
  if (list.length) {
    let all = $('.stat').map(function() {
      return this
    }).get()
    all.forEach(item => {
      item.innerHTML = ''
    })
    // Calculate average show score
    let totalScore = list.reduce(((accumulator, currentValue) => accumulator + currentValue.rating), 0)
    $('#averageScore').append(Math.round(totalScore / list.length * 10) / 10)
    // Sum number of movies watched
    let numMovies = list.reduce(((accumulator, currentValue) => currentValue.type == 'Movie' && currentValue.status !== 'Plan to Watch' ? accumulator + 1 : accumulator), 0)
    $('#numMovies').append(numMovies)
    // Sum number of TV Series watched
    let numTV = list.reduce(((accumulator, currentValue) => currentValue.type !== 'Movie' && currentValue.status !== 'Plan to Watch' ? accumulator + 1 : accumulator), 0)
    $('#numTV').append(numTV)
    // List number of shows Finished
    let numFinished = list.reduce(((accumulator, currentValue) => currentValue.status == 'Completed' ? accumulator + 1 : accumulator), 0)
    $('#numFinished').append(numFinished)
    // List number of shows currently watching
    let numWatching = list.reduce(((accumulator, currentValue) => currentValue.status == 'Watching' ? accumulator + 1 : accumulator), 0)
    $('#numWatching').append(numWatching)
    // List number of shows Planning to watch
    let numPlanToWatch = list.reduce(((accumulator, currentValue) => currentValue.status == 'Plan to Watch' ? accumulator + 1 : accumulator), 0)
    $('#numPlanToWatch').append(numPlanToWatch)
  }
}








