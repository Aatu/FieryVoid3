import Critical from "./Critical";
declare class ForcedOffline extends Critical {
    getMessage(): string;
    excludes(critical: Critical): boolean;
    isReplacedBy(critical: Critical): boolean;
}
export default ForcedOffline;
