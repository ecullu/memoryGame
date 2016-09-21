import React from 'react'
import ReactDOM from 'react-dom'


const app = function() {
	//Constructor to create images
	const Img = function (imgUrl, imgId){
		this.url = imgUrl
		this.id = imgId
		this.pairId = imgId
		this.matched = false
		this.numberofClicks = 0
	}
	var i = 0
	var gameTimer 
	const imgArray = []
	const photoStr = '/images/image_1.jpg,/images/image_2.jpg,/images/image_3.jpg,/images/image_4.jpg,/images/image_5.jpg,/images/image_6.jpg,/images/image_7.jpg,/images/image_8.jpg,/images/image_9.jpg,/images/image_10.jpg'
	const photoArr = photoStr.split(',')
	//creates images by using contructor and push it to image array
	photoArr.forEach(function(url){
		imgArray.push(new Img(url,i))
		i += 2
	})
	//define shuffle function
	function shuffle(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle…
	  while (m) {

	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	}

	
	const GameView = React.createClass({
		getInitialState: function(){
			return {
				selectingCard: false,
				selectedCards: [],
				cardList: [],
				elapsedTime: 0
			}
		},

		componentWillMount: function(){
			this.setState({
				cardList: shuffle(this._cloneArray())
			})
		},

		_findCardById: function(cardId){
			var card = {}
			this.state.cardList.forEach(function(img){
				if(img.id === cardId){
					card = img
				}
			})
			return card
		},

		_compareCards: function(card1,card2){
			if(card1.pairId === card2.pairId){
				return true
			}
			else{
				return false
			}
		},

		_updateStates: function (){
			console.log('updating states')
			this.state.selectingCard = false
			this.state.selectedCards.splice(0)
			this.setState({
			selectingCard: this.state.selectingCard,
			selectedCards: this.state.selectedCards
			})
		},

		//updates the matched states if when selected cards are matched
		_updateMatchedCards: function(card1, card2){
			card1.matched = true
			card2.matched = true
			console.log('card1 >>',card1)
		},

				//increment time
		_timeCounter: function(){
			if(!this._endGame()){
				// console.log('elapsed time>>', this.state.elapsedTime)
				this.state.elapsedTime += 1
			}
			else{
				clearInterval(gameTimer)
			}
		},

		//starts timer
		_startTimer: function(){
			document.getElementById('pre-game-wrapper').style.opacity = 0
			setTimeout(function(){
				if(document.getElementById('pre-game-wrapper').style.visibility !== "hidden"){
					document.getElementById('pre-game-wrapper').style.visibility = "hidden"
				}
			},1500)
			gameTimer = setInterval(this._timeCounter,1000)
		},

		//checks if all cards are matched (game over)
		_endGame: function(){
			var allMatched = true
			this.state.cardList.forEach(function(card){
				if(!card.matched){
					allMatched = false
					return
				}
			})
			return allMatched
		},

		_countClick: function (){
			let totalClicks = 0
			
				this.state.cardList.forEach(function(card){
					totalClicks += card.numberofClicks
				})
			
			console.log('total click >', totalClicks)
			return totalClicks
		},

		_selectCard: function(cardId){
			console.log('cardList>>', this.state.cardList)
			let selectedCard = this.state.cardList.filter(function(card){				
				return card.id === parseInt(cardId)
			})[0]
			selectedCard.numberofClicks += 1
			if(this.state.selectedCards.length < 2){
				this.state.selectingCard = true
				this.state.selectedCards.push(parseInt(cardId))
				this.setState({
					selectingCard: this.state.selectingCard,
					selectedCards: this.state.selectedCards
				})
			}
			if(this.state.selectedCards.length === 2){
					var card1 = this._findCardById(this.state.selectedCards[0])
					var card2 = this._findCardById(this.state.selectedCards[1])
					console.log('comparing cards>>> ' + card1 + card2)
					var matched = this._compareCards(card1,card2)
					if(matched){
						console.log('cards matched')
						this._updateMatchedCards(card1,card2)
						setTimeout(this._updateStates, 2000)
					}
					else {
						setTimeout(this._updateStates, 2000)
					}
				}
		},

		//creates a copy of image array to duplicate the images
		_cloneArray: function(){
			var shuffledArr = shuffle(imgArray)
			var clonedShuffle = JSON.parse(JSON.stringify(shuffledArr))
			return shuffledArr.concat(clonedShuffle.map((img)=>{
				img.id = img.id + 1
				return img
			}))
		},
		

		_getJsxArray: function(array){
			var self = this
			var gameCards = array.map(function(singleCard){
				return <Card key={singleCard.id}card={singleCard} selectCard={self._selectCard} selectedCards={self.state.selectedCards} selectingCard={self.state.selectingCard}/>
			})
			return gameCards
		},

		// Play again
		_replay: function(){
			//restart game timer
			this._startTimer()
			//gathers all matched cards
			let matchedCards = this.state.cardList
			// shuffles cards
			shuffle(matchedCards)
			//updates the cards matched attribute
			matchedCards.forEach(function(card){
				card.matched = false
				card.numberofClicks = 0
			})
			//updates the cardlist and elapsedTime states
			this.setState({
				cardList: matchedCards,
				elapsedTime: 0
			})
		},
		
		render: function () {
			var preGameDiv = 'pre-game-wrapper'
			var preGameMessageDiv = 'pre-game-msg'
			var postGameDiv = 'post-game-wrapper hide-msg'
			var postGameMessageDiv = 'post-game-msg hide-msg'
			var playAgainBtn = 'play-again-btn'
			var playBtn = 'play-btn'
			var totalTime = ""

			if(this._endGame()){
				postGameDiv = 'post-game-wrapper show-msg'
				postGameMessageDiv = 'post-game-msg show-msg'
				var totalClicks = this._countClick()
			}

			if(this.state.elapsedTime > 60){
				totalTime = parseInt(this.state.elapsedTime/60) + ":" + this.state.elapsedTime%60
			}
			else{
				totalTime = this.state.elapsedTime%60 + " seconds"
			}

			return (
				<div>
					<div id="header">
						<h2>Match Me If You Can</h2>
						<h5>Memory Game</h5>
					</div>
					<div className="card-wrapper">
						{this._getJsxArray(this.state.cardList)}
					</div>
					<div id={preGameDiv}>
						<div className={preGameMessageDiv}>
							<h3>Welcome to</h3>
							<h2>Match Me If You Can</h2>
							<p>Match all the cards with their pairs and win the game</p>
							<button className={playAgainBtn} onClick={this._startTimer}>Play</button>
						</div>
					</div>
					<div className={postGameDiv}>
						<div className={postGameMessageDiv}>
							<img src="/images/congrats.png"/>
							<h2>You've matched all the cards</h2>
							<p>Total Clicks: <span><strong>{totalClicks}</strong></span></p>
							<p>Total Time: <span><strong>{totalTime}</strong></span></p>
							<button className={playAgainBtn} onClick={this._replay}>Play again</button>
						</div>
					</div>
				</div>
			) 
		}
	})

	const Card = React.createClass({
		// getInitialState: function(){
		// 	return {
		// 	cardMatchedState: this.props.card.matched
		// 	}
		// },
		//When card is selected, runs a selectCard function in Gameview
		_select: function(e){
				this.props.selectCard(e.target.id)
		},

		render: function(){
			var cardDiv = 'card'
			var imageBack = 'image-back',
				imageFront = 'image-front'
			// console.log('matched status', this.state.cardMatchedState)
			//flips only 2 cards at the same time	
			if(this.props.selectedCards.length <= 2){
				if(this.props.selectedCards.includes(this.props.card.id)){
					console.log('flip the card')
					imageFront= 'flip-front'
					imageBack = 'flip-back' 
				}
			}
			//hides the card if it is matched
			if(this.props.card.matched){
				cardDiv = 'card hide-card'
			}

			return (
				<div className={cardDiv} onClick={this._select} data-card={this.props.card}>
					<img className={imageBack} src={this.props.card.url} />
					<img data-card={this.props.card.id} id={this.props.card.id} className={imageFront} src="http://www.sfhealthnetwork.org/wp-content/uploads/Question-Mark-Button-150x150.png"/>
				</div>
				)
		}
	})

	ReactDOM.render(<GameView />,document.querySelector('.container'))
}

app()