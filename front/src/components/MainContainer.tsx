import React, { useState } from 'react';
import './MainContainer.css';

import { IonGrid, IonRow, IonCol } from '@ionic/react';

import SearchBar from './SearchBar/SearchBar';
import InfoOutput from './InfoOutput/InfoOutput';

interface ContainerProps { }

const MainContainer: React.FC<ContainerProps> = () => {
    const [searchText, setSearchText] = useState('');

    const seachCommiterHandler = () => {
        setSearchText('');
        alert(`Looking for ${searchText}!`);
    };

    return (
        <IonGrid>
            <IonRow>
                <IonCol size-md="4" offset-md="4">
                    <SearchBar 
                        searchText={searchText} 
                        setSearchText={setSearchText} 
                        seachCommiter={seachCommiterHandler}
                    />
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol size-md="6" offset-md="3">
                    <InfoOutput />
                </IonCol>
            </IonRow>
        </IonGrid>
    );
};

export default MainContainer;
