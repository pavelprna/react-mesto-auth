import { useEffect, useState } from "react";
import { Switch, Route, withRouter } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import api from "../utils/api";
import { currentUserContext } from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [cards, setCards] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    Promise.all([api.getUser(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoaded(false));
  }, [])

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setSelectedCard(null);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err));
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  const confirmCardDelete = (card) => {
    setSelectedCard(card);
    setIsConfirmationPopupOpen(true);
  }

  const handleUpdateUser = (data) => {
    api.updateUser(data)
      .then(user => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  const handleUpdateAvatar = (data) => {
    api.changeAvatar(data)
      .then(user => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  const handleAddPlaceSubmit = (data) => {
    api.createCard(data)
      .then(newCard => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="page">
      <currentUserContext.Provider value={currentUser}>
        <Header />
        <Switch>
          <Route path='/sign-up'>
            <Register title="Регистрация"
            buttonText="Зарегистрироваться" />
          </Route>
          <Route path='/sign-in'>
            <Login title="Вход"
            buttonText="Войти"
            />
          </Route>
          <ProtectedRoute path='/'
            loggedIn={loggedIn}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={confirmCardDelete}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            isLoaded={isLoaded}
            component={Main} />
        </Switch>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
          onClose={closeAllPopups} />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} />

        <ConfirmationPopup
          card={selectedCard}
          isOpen={isConfirmationPopupOpen}
          onClose={closeAllPopups}
          onConfirm={handleCardDelete} />

        <ImagePopup
          isOpen={isImagePopupOpen}
          card={selectedCard}
          onClose={closeAllPopups} />

      </currentUserContext.Provider>
    </div>
  );
}

export default withRouter(App);
