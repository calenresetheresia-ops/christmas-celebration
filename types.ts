
export enum AppTab {
  SANTA_CHAT = 'SANTA_CHAT',
  CARD_STUDIO = 'CARD_STUDIO',
  GIFT_ELF = 'GIFT_ELF',
}

export interface Message {
  role: 'user' | 'santa';
  text: string;
  id: string;
}

export interface GiftIdea {
  item: string;
  reason: string;
  estimatedPrice: string;
}

export interface CardState {
  image: string | null;
  message: string;
  loading: boolean;
}
