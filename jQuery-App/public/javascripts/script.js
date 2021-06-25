let list = []
let id = 0
class Show {
  constructor(pname, ptype, pstatus, prating, pURL) {
    this.name = pname
    this.type = ptype
    this.status = pstatus
    this.rating = prating
    this.URL = pURL
    this.id = id++
  }
}

function makeString(item) {
  return item.type + ': "' + item.name + '", ' + 'Current Status: '+ item.status +  ', Rating: ' + item.rating
}

$(document).on("pagebeforeshow","#list",function() {
  showServerEntries()
});

$(document).on('pagebeforeshow','#stats',function() {
  showValues()
})

// function formSubmitEvent() {
//   // Get name of movie and rating
//   let showName = $('#showName').val();
//   let type = $('#type').val();
//   let status = $('#status').val();
//   let rating = $('#rating').val();
//   let url = $('#url').val();
//   let show = new Show(showName, type, status, parseInt(rating), url)
//   // Validate the object values?
//   let result = true
//   if (result) {
//     // Add object to list
//     list.push(show)
    
//     // Set fields to blank string
//   $('#showName').val('');
//   $('#url').val('');
//   } else {
//     // Alert of bad values
//     alert("Please fill in the fields with a valid entry.")
//   }
// }

function addServerItem() {
  let showName = $('#showName').val();
  let type = $('#type').val();
  let status = $('#status').val();
  let rating = $('#rating').val();
  let url = $('#url').val();
  let show = new Show(showName, type, status, parseInt(rating), url)

  $.ajax({
    url: '/addItem',
    type: 'POST',
    data: JSON.stringify(show),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(result) {
      console.log(result)
    }
  })
  $('#showName').val('');
  $('#url').val('');
}

// function showEntries() {
//   let parent = $('#listId')
//   parent.empty() // Removes all existing child elements
//   // Adds all list elements to display
//   list.forEach(item => {
//     let text = item.getAll()
//     // Check if a url was entered
//     if (item.URL === '') {
//       // Default to imdb search
//       const searchItem = item.name.replace(/\s/g, '+')
//       item.URL = 'https://www.imdb.com/find?q=' + searchItem + '&ref_=nv_sr_sm'
//     }
//     let newElement = document.createElement('li')
//     let listItem = document.createElement('li')
//     let deleteButton = document.createElement('button')
//     let content = document.createElement('div')

//     content.addEventListener('click', 
//       function (event) {
//         event.preventDefault()
//         if (confirm('You are about to open a new window. Please confirm.')) {
//           window.open(item.URL)
//         }
//       },
//       false)
//     content.innerHTML = text
//     content.className = 'itemText'
//     deleteButton.onclick = function() { 
//       let listIndex = Array.prototype.indexOf.call(newElement.parentNode, newElement)
//       list.splice(0, 1)
//       newElement.parentNode.removeChild(newElement) 
//     }
//     deleteButton.innerHTML = 'X'

//     newElement.appendChild(deleteButton)
//     newElement.appendChild(content)
//     newElement.className = 'item'

//     // Add it to the unordered list
//     parent.append(newElement);
//   })
// }

function showValues() {
  $.get('/getList', function(data, status) {
    list = data
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
  })
}

function showServerEntries() {
  let parent = $('#listId')
  parent.empty() // Removes all existing child elements

  $.get('/getList', function(data, status) {
    list = data
    console.log(data)
    list.forEach(item => {
      let text = makeString(item)
      // Check if a url was entered
      if (item.URL === '') {
        // Default to imdb search
        const searchItem = item.name.replace(/\s/g, '+')
        item.URL = 'https://www.imdb.com/find?q=' + searchItem + '&ref_=nv_sr_sm'
      }
      let newElement = document.createElement('li')
      let listItem = document.createElement('li')
      let deleteButton = document.createElement('button')
      let content = document.createElement('div')
  
      content.addEventListener('click', 
        function (event) {
          event.preventDefault()
          if (confirm('You are about to open a new window. Please confirm.')) {
            window.open(item.URL)
          }
        },
        false)
      content.innerHTML = text
      content.className = 'itemText'
      deleteButton.onclick = function() {
        let listIndex = item.id
        // list.splice(0, 1)
        // console.log(listIndex)
        $.ajax({
          type: 'DELETE',
          url: '/deleteItem/' + listIndex,
          success: function(result) {
            // console.log(result)
            // document.location.href = 'index.html#list'
            newElement.parentNode.removeChild(newElement) 
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log('Error')
            alert('Server could not delete movie with id: '+ listIndex)
          }
        })
      }
      deleteButton.innerHTML = 'X'
  
      newElement.appendChild(deleteButton)
      newElement.appendChild(content)
      newElement.className = 'item'
  
      // Add it to the unordered list
      parent.append(newElement);
    })
  })
}




