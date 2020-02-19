import React, { SetStateAction, Dispatch } from 'react';
import './SearchBar.css';

import { IonInput, IonLabel, IonItem, IonButton, IonIcon } from '@ionic/react';
import { playForward } from 'ionicons/icons';

interface SearchProps {
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
    seachCommiter: () => void;
}

const SearchBar: React.FC<SearchProps> = props => {
    const { setSearchText, searchText, seachCommiter } = props;

    return (
        <div className="search-container">
            <IonItem className="search-bar">
                <IonLabel position="floating">C'mon and search for a Commiter!</IonLabel>
                <IonInput 
                    type="text" 
                    value={searchText} 
                    onIonChange={event => setSearchText((event.target as HTMLInputElement).value)}>
                </IonInput>
            </IonItem>
            <IonButton onClick={seachCommiter}>
                <IonIcon icon={playForward} slot="start"></IonIcon>
                GO!
            </IonButton>
        </div>
    );
}

export default SearchBar;