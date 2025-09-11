import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, X, Sparkles } from 'lucide-react';
import { UpdateChecker } from '@/utils/updateChecker';

export const UpdateNotification: React.FC = () => {
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const checkUpdates = async () => {
      const checker = new UpdateChecker();
      const info = await checker.checkForUpdates();
      
      if (info.hasUpdate) {
        setUpdateInfo(info);
        setIsVisible(true);
      }
    };

    // Check on mount
    checkUpdates();
    
    // Check every 24 hours
    const interval = setInterval(checkUpdates, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async () => {
    if (!updateInfo?.downloadUrl) return;
    
    setIsDownloading(true);
    const checker = new UpdateChecker();
    
    try {
      await checker.downloadUpdate(updateInfo.downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Show again tomorrow
    setTimeout(() => setIsVisible(true), 24 * 60 * 60 * 1000);
  };

  if (!isVisible || !updateInfo) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="bg-gradient-to-br from-primary/20 to-primary-glow/20 border-primary/30 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Update Available!</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            <Badge variant="secondary" className="text-xs">
              v{updateInfo.latestVersion}
            </Badge>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {updateInfo.releaseNotes && (
            <div className="mb-4">
              <h4 className="font-medium text-sm mb-2">What's New:</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {updateInfo.releaseNotes}
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Update Now'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDismiss}
              size="sm"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};