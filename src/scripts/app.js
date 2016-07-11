import React from 'react'
import ReactDOM from 'react-dom'


const app = function() {

	const Img = function (imgUrl, imgId){
		this.url = imgUrl
		this.id = imgId
		this.pairId = imgId
		this.matched = false
	}
	var i = 0
	const imgArray = []
	const photoStr = 'http://bit.ly/29H0REb http://bit.ly/29p1i16 http://bit.ly/29p1EVp http://bit.ly/29lpWDJ http://bit.ly/29r6aoT http://bit.ly/29CEm0n http://bit.ly/29xQwr0 http://bit.ly/29yAxe0 http://bit.ly/29yAzmc http://bit.ly/29mdleJ'
	// const photoStr = 'http://bit.ly/29p1i16 http://bit.ly/29H0REb'
	const photoArr = photoStr.split(' ')
	// console.log('photo arrr>>> ',photoArr)
	photoArr.forEach(function(url){
		imgArray.push(new Img(url,i))
		i += 2
	})

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
				cardList: []
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
			// console.log('find card by id',card)
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
			// console.log('selected card array >>' + this.state.selectedCards)
			this.setState({
			selectingCard: this.state.selectingCard,
			selectedCards: this.state.selectedCards
			})
		},

		_updateMatchedCards: function(card1, card2){
			card1.matched = true
			card2.matched = true
			console.log('card1 >>',card1)
		},

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

		_selectCard: function(cardId){
			// console.log('card id in _selectCard',cardId)
			if(this.state.selectedCards.length < 2){
				this.state.selectingCard = true
				this.state.selectedCards.push(parseInt(cardId))
				this.setState({
					selectingCard: this.state.selectingCard,
					selectedCards: this.state.selectedCards
				})
			}
			if(this.state.selectedCards.length === 2){
					// console.log(this._findCardById(this.state.selectedCards[0]))
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

			console.log('selected card array length >> ',this.state.selectedCards.length)
		},

		_cloneArray: function(){
			var shuffledArr = shuffle(imgArray)
			var clonedShuffle = JSON.parse(JSON.stringify(shuffledArr))
			// console.log('original images',shuffledArr)
			return shuffledArr.concat(clonedShuffle.map((img)=>{
				img.id = img.id + 1
				return img
			}))
		},
		

		_getJsxArray: function(array){
			var self = this
			var gameCards = array.map(function(singleCard){
				return <Card card={singleCard} selectCard={self._selectCard} selectedCards={self.state.selectedCards} selectingCard={self.state.selectingCard}/>
			})
			return gameCards
		},
		
		render: function () {
			// console.log('renderin card list >>',this.state.cardList)
			var postGameDiv = 'post-game hide-victory'
			var postGameImgDiv = 'post-game-img'

			if(this._endGame()){
				postGameDiv = 'post-game'
				postGameImgDiv = 'post-game-img show-image '
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
					<div className={postGameDiv}>
						<img className={postGameImgDiv} src="https://media.giphy.com/media/iPTTjEt19igne/giphy.gif"/>
					</div>
				</div>
				) 

			
			
		}
	})

	const Card = React.createClass({
		_select: function(e){
			// console.log('_select in card',this.props.selectCard)
			// this.props.selectCard(e.target)
			// console.log('this in Card >>>', this)
			// console.log(e.target.id)
				this.props.selectCard(e.target.id)
		},

		render: function(){
			var cardDiv = 'card'
			var imageBack = 'image-back',
				imageFront = 'image-front'
			// console.log('rendering card view')
			// console.log('selected cards >>> ',this.props.selectedCards)
			// console.log('rendered card id', this.props.card.id )
			// console.log('selecting cards >>> ',this.props.selectingCard)
			if(this.props.selectedCards.length <= 2){
				if(this.props.selectedCards.includes(this.props.card.id)){
					console.log('flip the card')
					imageFront= 'flip-front'
					imageBack = 'flip-back' 
				}
			}

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