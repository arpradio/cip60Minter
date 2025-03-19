import { Dispatch, SetStateAction } from 'react';

export interface Artist {
  id: string;
  name: string;
  isni?: string;
  links: Record<string, string>;
}

export interface ContributingArtist extends Artist {
  ipn?: string;
  ipi?: string;
  roles: string[];
}

export interface Author {
  id: string;
  name: string;
  ipi?: string;
  share?: string;
  role?: string;
}

export interface PinataResponse {
  success: boolean;
  cid?: string;
  error?: string;
}

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: Dispatch<SetStateAction<SearchFilters>>;
}

export interface Copyright {
  master: string;
  composition: string;
}



 export interface Asset {
     id: number;
     policy_id: string;
     asset_name: string;
     metadata_version: string;
     metadata_json: MetadataJson;
     created_at: string;
   }
 
  export  interface MetadataJson {
     name?: string;
     image?: string;
     release?: {
      artists?: Array<{
        name?: string;
        links?: Record<string, string | string[]>;
      }>;
      copyright?: {
        master: string;
        composition: string;
      };
      release_title?: string;
      release_type?: string;
      genres?: string[];
      authors?: Array<{
        name: string;
        share?: string;
      }>
    }
     files: Array<{
       mediaType?: string;
       name?: string;
       src?: string;
       song?: {
         song_title?: string;
         artists?: Array<{
           name: string;
           links?: Record<string, string>;
         }>;
         explicit?: boolean;
         parental_advisory?: boolean;
         ai_generated?: boolean;
         isrc?: string;
         iswc?: string;
         genres?: string[];
         authors?: Array<{
           name: string;
           share?: string;
         }>;
         copyright?: {
           master: string;
           composition: string;
         };
       };
     }>;
   }

 export interface Author {
    name: string;
    share?: string;
  }
  
  export  interface Copyright {
    master: string;
    composition: string;
  }
  
  export interface Song {
    song_title?: string;
    artists?: Artist[];
    explicit?: boolean;
    isAIGenerated?: boolean;
    genres?: string[];
    authors?: Author[] ;
    copyright?: Copyright;
  }
  
  export  interface FileDetails {
    mediaType?: string;
    name?: string;
    src?: string;
    song?: {
      authors?: Array<{
        name: string;
        share?: string;
      }>;
      song_title?: string;
      artists?: Array<{
        name?: string;
        links?: Record<string, string | string[]>;
      }>;
      genres?: string[];
      producer?: string | string[];
      featured_artist?: string;
      contributing_artist?: string[];
      isAIGenerated?: boolean;
      explicit?: boolean;
      parental_advisory?: boolean;
      isrc?: string;
      iswc?: string;
      copyright?: {
        master: string;
        composition: string;
      };
    };
  }
    

  
export  interface Asset {
    id: number;
    policy_id: string;
    asset_name: string;
    metadata_version: string;
    metadata_json: MetadataJson;
    created_at: string;
  }
  
 export interface AssetCardProps {
    asset: Asset;
    onClick: () => void;
  }
  
export interface AssetDetailsProps {
    asset: Asset;
    onClose: () => void;
  }
  
  interface Object {
    [key: string]: any;
  }

export interface Release {
  id: number;
  policy_id: string;
  asset_name: string;
  metadata_version: string;
  metadata_json: {
    name: string;
    image: string;
    music_metadata_version: number;
    release?: {
      artists?: Array<{
        name?: string;
        links?: Record<string, string | string[]>;
      }>;
      copyright?: {
        master: string;
        composition: string;
      };
      release_title?: string;
      release_type?: string;
      genres?: string[];
      authors?: Array<{
        name: string;
        share?: string;
      }>
    };
    files: Array<{
      name: string;
      mediaType: string;
      src: string;
      song: {
        song_title: string;
        song_duration: string;
        track_number: string;
        artists?: Array<{
          name: string;
          isni?: string;
          links?: Record<string, string>;
        }>;
        featured_artists?: Array<{
          name: string;
          isni?: string;
          links?: Record<string, string>;
        }>;
        contributing_artists?: Array<{
          name: string;
          ipn?: string;
          ipi?: string;
          roles?: string[];
          links?: Record<string, string>;
        }>;
        genres?: string[];
        copyright?: {
          master: string;
          composition: string;
        };
        explicit?: boolean;
        parental_advisory?: boolean;
        isAIGenerated?: boolean;
        isrc?: string;
        iswc?: string;
      };
    }>;
  };
}

export interface CIP60FormData {
  releaseTitle: string;
  songTitle: string;
  isAIGenerated: boolean;
  isExplicit: boolean;
  recordingOwner: string;
  compositionOwner: string;
  isrc?: string;
  iswc?: string;
  quantity: number;
  producer: string;
  mastering_engineer: string;
  mix_engineer: string;
  genre: string;
  subGenre1?: string;
  subGenre2?: string;
  songFile: File | null; 
  coverArtFile: File | null;
  artists: Artist[];
  featuredArtists: Artist[];
  contributingArtists: ContributingArtist[];
  authors: Author[];
}

export type Network = 'preprod' | 'mainnet';

export interface FormStateUpdate {
  field: keyof CIP60FormData;
  value: string | number | boolean | File | null | Artist[] | ContributingArtist[] | Author[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface MetadataBuilderParams {
  formData: CIP60FormData;
  songIPFS: string;
  coverIPFS: string;
  audioFormat: string;
  minutes: number;
  seconds: number;
}

export interface NetworkSelectorProps {
  selectedNetwork: Network;
  onNetworkChange: (network: Network) => void;
}

export interface PreviewProps {
  formData: CIP60FormData;
}

export interface AlbumMetadata {
  artists: Artist[];
  contributingArtists: ContributingArtist[];
  genres: string[];
  copyright: {
    master: string;
    composition: string;
  }
}

export interface SearchFilters {
  searchTerm: string;
  searchFields: {
    name: boolean;
    title: boolean;
    artist: boolean;
    genre: boolean;  
    producer: boolean;
    engineer: boolean;
  };
  genre?: string;
  releaseType?: string;
}

export interface TrackFormData {
  songTitle: string;
  trackNumber: string;
  songFile: File | null;
  isAIGenerated: boolean;
  isExplicit: boolean;
  featuredArtists: Artist[];
  authors: Author[];
  producer: string;
  mixEngineer: string;
  masteringEngineer: string;
  isrc?: string;
  iswc?: string;
}

export interface ArtistFormProps {
  artist: Artist | ContributingArtist;
  onUpdate: (artist: Artist | ContributingArtist) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}