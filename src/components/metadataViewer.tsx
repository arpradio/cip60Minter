import React, { useMemo } from 'react';
import { Music2, Link as LinkIcon, FileJson, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetadataViewerProps {
  data: any;
  className?: string;
  onFieldClick?: (path: string, value: any) => void;
}

const MetadataViewer: React.FC<MetadataViewerProps> = ({ data, className, onFieldClick }) => {
  const extractArtists = useMemo(() => {
    const artists = new Set<string>();
    
    const processArtist = (artist: any) => {
      if (typeof artist === 'string') {
        artists.add(artist);
      } else if (artist && (artist.name || artist['name:'])) {
        artists.add(artist.name || artist['name:']);
      }
    };

    if (data.artists) {
      if (Array.isArray(data.artists)) {
        data.artists.forEach(processArtist);
      } else if (typeof data.artists === 'string') {
        artists.add(data.artists);
      } else {
        processArtist(data.artists);
      }
    }

    if (data.featured_artists) {
      if (Array.isArray(data.featured_artists)) {
        data.featured_artists.forEach((artist: any) => {
          if (typeof artist === 'string') {
            artists.add(`${artist} (Featured)`);
          } else if (artist.name || artist['name:']) {
            artists.add(`${artist.name || artist['name:']} (Featured)`);
          }
        });
      } else if (typeof data.featured_artists === 'string') {
        artists.add(`${data.featured_artists} (Featured)`);
      }
    }

    if (data.contributing_artists) {
      if (Array.isArray(data.contributing_artists)) {
        data.contributing_artists.forEach((artist: any) => {
          const name = artist.name || artist['name:'];
          const role = artist.role ? ` (${Array.isArray(artist.role) ? artist.role.join(', ') : artist.role})` : '';
          if (name) {
            artists.add(`${name}${role}`);
          }
        });
      }
    }

    if (data.files) {
      data.files.forEach((file: any) => {
        if (file.song && file.song.artists) {
          file.song.artists.forEach((artist: any) => {
            if (typeof artist === 'string') {
              artists.add(artist);
            } else if (artist.name || artist['name:']) {
              artists.add(artist.name || artist['name:']);
            }
          });
        }
      });
    }

    return Array.from(artists);
  }, [data]);

  const extractGenres = useMemo(() => {
    const genres = new Set<string>();

    if (data.genres) {
      if (Array.isArray(data.genres)) {
        data.genres.forEach((genre: string) => genres.add(genre));
      } else if (typeof data.genres === 'string') {
        genres.add(data.genres);
      }
    }

    if (data.files) {
      data.files.forEach((file: any) => {
        if (file.song && file.song.genres) {
          if (Array.isArray(file.song.genres)) {
            file.song.genres.forEach((genre: string) => genres.add(genre));
          } else if (typeof file.song.genres === 'string') {
            genres.add(file.song.genres);
          }
        }
      });
    }

    return Array.from(genres);
  }, [data]);

  const extractLinks = useMemo(() => {
    const links: Record<string, string[]> = {};
    
    const processLinks = (linkData: any) => {
      if (!linkData) return;
      
      Object.entries(linkData).forEach(([platform, value]) => {
        if (Array.isArray(value)) {
          if (!links[platform]) links[platform] = [];
          links[platform].push(...value.filter(Boolean));
        } else if (typeof value === 'string' && value.trim()) {
          if (!links[platform]) links[platform] = [];
          links[platform].push(value);
        }
      });
    };

    processLinks(data.links);

    if (data.artists && Array.isArray(data.artists)) {
      data.artists.forEach((artist: any) => {
        if (artist.links) {
          processLinks(artist.links);
        }
      });
    }

    return links;
  }, [data]);

  const hasMetadata = useMemo(() => {
    return extractArtists.length > 0 ||
           extractGenres.length > 0 ||
           Object.entries(extractLinks).length > 0 ||
           (data.files && data.files.filter((f: any) => f.name || (f.song && (f.song.name || f.song.song_duration))).length > 0) ||
           data.copyright;
  }, [extractArtists, extractGenres, extractLinks, data]);

  if (!hasMetadata) {
    return null;
  }

  const renderFiles = () => {
    const meaningfulFiles = data.files?.filter((file: any) => 
      file.name || 
      (file.song && (file.song.name || file.song.song_duration || file.song.track_number))
    ) || [];

    if (meaningfulFiles.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          Files
        </h3>
        <div className="space-y-2">
          {meaningfulFiles.map((file: any, index: number) => (
            <div key={`file-${index}`} className="p-3 bg-neutral-800 border-[1px] rounded-lg">
              <div className="flex items-center gap-2">
                {file.mediaType?.startsWith('audio/') ? (
                  <Music2 className="h-4 w-4" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                <span>{file.name || 'Unnamed File'}</span>
              </div>
              {file.song && (
                <div className="mt-2 text-sm text-gray-400">
                  {file.song.song_duration && (
                    <span className="mr-4">Duration: {file.song.song_duration}</span>
                  )}
                  {file.song.track_number && (
                    <span>Track: {file.song.track_number}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("bg-stone-900/40 text-white w-96", className)}>
      <CardContent className="p-6">
        <ScrollArea className="max-h-[60dvh] overflow-y pr-4">
          <>
            {extractArtists.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Music2 className="h-5 w-5" />
                  Artists
                </h3>
                <div className="space-y-1">
                  {extractArtists.map((artist, index) => (
                   <a key={artist} href={`/assets?search=${artist}`}> <Badge 
                      key={`artist-${artist}-${index}`}
                      variant="secondary" 
                      className="mr-2 mb-2"
                    >
                      {artist}
                    </Badge></a>
                  ))}
                </div>
              </div>
            )}

            {extractGenres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Music2 className="h-5 w-5" />
                  Genres
                </h3>
                <div className="space-y-1">
                  {extractGenres.map((genre, index) => (
                    <a 
                      key={`genre-${genre}-${index}`}
                      href={`/assets?genre=${encodeURIComponent(genre)}`}
                    >
                      <Badge 
                        variant="outline" 
                        className="text-gray-200 mr-2 mb-2 bg-blue-900"
                      >
                        {genre}
                      </Badge>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {Object.entries(extractLinks).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Links
                </h3>
                <div className="space-y-2">
                  {Object.entries(extractLinks).map(([platform, urls]) => (
                    <div key={`platform-${platform}`} className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-400 capitalize">{platform}</h4>
                      {urls.map((url, index) => (
                        <a
                          key={`${platform}-url-${index}`}
                          href={url.startsWith('http') ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-400 hover:text-blue-300 text-sm"
                        >
                          {url}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {renderFiles()}

            {data.copyright && (
              <div className="text-sm text-gray-400">
                <p>{data.copyright}</p>
              </div>
            )}
          </>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MetadataViewer;