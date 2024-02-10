export default interface Member {
  id: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  positions?: string[];
}
