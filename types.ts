import React from 'react';

export enum AppMode {
  MOCKUP = 'MOCKUP',
  EDITOR = 'EDITOR',
  GENERATOR = 'GENERATOR'
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export enum ProductType {
  MUG = 'MUG',
  TSHIRT = 'TSHIRT',
  HOODIE = 'HOODIE',
  TOTE = 'TOTE',
  CAP = 'CAP'
}

export interface ProductPreset {
  id: ProductType;
  name: string;
  promptTemplate: string;
  icon: React.ReactNode;
}