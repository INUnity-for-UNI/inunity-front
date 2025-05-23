export type ContractType = "SNS" | "WEBSITE" | "ETC";

export interface RequestCreateUpdateContract {
  contractId?: number;
  type: ContractType;
  name: string;
  url: string;
}

export default interface ProfileDto {
  nickname: string;
  description: string;
  graduateDate?: string;
  isGraduation?: boolean;
  isAnonymous?: boolean;
  organization: string;
  job: string;
  profileImageUrl: string;
  contracts: RequestCreateUpdateContract[];
}
