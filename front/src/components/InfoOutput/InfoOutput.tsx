import React, { Fragment } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';

const InfoOutput: React.FC = () => {
    return (
        <Fragment>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Info Output</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                    Keep close to Nature's heart... and break clear away, once in awhile,
                    and climb a mountain or spend a week in the woods. Wash your spirit clean.
                </IonCardContent>
            </IonCard>
        </Fragment>
    )
}

export default InfoOutput;