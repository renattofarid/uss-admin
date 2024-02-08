import React, { useState } from 'react';
import { ProvincesShipment, Shipment } from '@/services/shipment';

interface ShipmentContextType {
    shipments: Shipment[];
    setShipments: React.Dispatch<React.SetStateAction<Shipment[]>>;
    draftShipment: Shipment[];
    setDraftShipment: React.Dispatch<React.SetStateAction<Shipment[]>>;
    shipmentSelected: Shipment | null;
    setShipmentSelected: React.Dispatch<React.SetStateAction<Shipment | null>>;
    provincesShipment: ProvincesShipment[];
    setProvincesShipment: React.Dispatch<React.SetStateAction<ProvincesShipment[]>>;
    provinceShipmentSelected: ProvincesShipment | null;
    setProvinceShipmentSelected: React.Dispatch<React.SetStateAction<ProvincesShipment | null>>;
}

export const ShipmentContext = React.createContext<ShipmentContextType>({
    shipments: [],
    setShipments: () => null,
    draftShipment: [],
    setDraftShipment: () => null,
    shipmentSelected: null,
    setShipmentSelected: () => null,
    provincesShipment: [],
    setProvincesShipment: () => null,
    provinceShipmentSelected: null,
    setProvinceShipmentSelected: () => null,
});

interface Props {
    children: React.ReactNode;
}
export const ShipmentProvider = ({ children }: Props) => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [draftShipment, setDraftShipment] = useState<Shipment[]>([]);
    const [shipmentSelected, setShipmentSelected] = useState<Shipment | null>(null);
    const [provincesShipment, setProvincesShipment] = useState<ProvincesShipment[]>([]);
    const [provinceShipmentSelected, setProvinceShipmentSelected] = useState<ProvincesShipment | null>(null);

    const contextValue: ShipmentContextType = {
        shipments,
        setShipments,
        draftShipment,
        setDraftShipment,
        shipmentSelected,
        setShipmentSelected,
        provincesShipment,
        setProvincesShipment,
        provinceShipmentSelected,
        setProvinceShipmentSelected,
    };

    return (
        <ShipmentContext.Provider value={contextValue}>
            {children}
        </ShipmentContext.Provider>
    );
};
