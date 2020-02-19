import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import MainContainer from '../components/MainContainer';
import './Home.css';

const Home: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Commit Wars</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <MainContainer />
            </IonContent>
        </IonPage>
    );
};

export default Home;
