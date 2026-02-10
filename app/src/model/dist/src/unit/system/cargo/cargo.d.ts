export declare const cargoClasses: {
    Ammo30mm: typeof import("../weapon/ammunition/conventional").Ammo30mm;
    Ammo85mmHE: typeof import("../weapon/ammunition/conventional").Ammo85mmHE;
    Ammo85mmAP: typeof import("../weapon/ammunition/conventional").Ammo85mmAP;
    Ammo140mmAP: typeof import("../weapon/ammunition/conventional").Ammo140mmAP;
    Ammo140mmHE: typeof import("../weapon/ammunition/conventional").Ammo140mmHE;
    Ammo120mmAP: typeof import("../weapon/ammunition/conventional").Ammo120mmAP;
    Ammo120mmHE: typeof import("../weapon/ammunition/conventional").Ammo120mmHE;
    Torpedo158MSV2: typeof import("../weapon/ammunition/torpedo").Torpedo158MSV2;
    Torpedo158MSV: typeof import("../weapon/ammunition/torpedo").Torpedo158MSV;
    Torpedo158Nuclear: typeof import("../weapon/ammunition/torpedo").Torpedo158Nuclear;
    Torpedo72MSV: typeof import("../weapon/ammunition/torpedo").Torpedo72MSV;
    Torpedo72HE: typeof import("../weapon/ammunition/torpedo").Torpedo72HE;
    Torpedo158HE: typeof import("../weapon/ammunition/torpedo").Torpedo158HE;
};
export type CargoType = keyof typeof cargoClasses;
export interface ICargo {
    getSpaceRequired(): number;
}
