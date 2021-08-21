import React from "react";
import { currentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const card = props.card;

  const currentUser = React.useContext(currentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `card__remove-button ${isOwn ? 'element__remove-button_visible' : 'element__remove-button_hidden'}`
  );

  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `${isLiked ? 'like__button_active' : 'like__button_inactive'}`;

  const handleOnClick = () => {
    props.onCardClick(card);
  }

  const handleLikeClick = () => {
    props.onCardLike(card);
  }

  const handleDeleteCard = () => {
    props.onCardDelete(card);
  }

  return (
    <li className="elements__list-item">
      <article className="element">
        <div className="element__square-container">
          <img src={card.link} alt={card.name} className="element__image" onClick={handleOnClick}/>
          <button className={`element__remove-button button ${cardDeleteButtonClassName}`} onClick={handleDeleteCard}/>
        </div>
        <h2 className="element__title">{card.name}</h2>
        <div className="like">
          <button type="button" className={`like__button button ${cardLikeButtonClassName}`} onClick={handleLikeClick}/>
          <span className="like__counter">{card.likes.length}</span>
        </div>
      </article>
    </li>
  )
}

export default Card;