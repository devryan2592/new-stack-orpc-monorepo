"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import {
  Loader2,
  Laptop,
  Smartphone,
  Trash2,
  Monitor,
  Settings,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Session {
  id: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  expiresAt: Date;
  isCurrent?: boolean;
}

export function SessionsList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(
    null
  );
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);

  const fetchSessions = async () => {
    try {
      const { data } = await authClient.listSessions();
      if (data) {
        setSessions(data as any);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    if (userAgent.toLowerCase().includes("mobile"))
      return <Smartphone className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getDeviceType = (userAgent?: string) => {
    if (!userAgent) return "Unknown Device";
    if (userAgent.toLowerCase().includes("mobile")) return "Mobile Device";
    return "Desktop Browser";
  };

  const getBrowserName = (userAgent?: string) => {
    if (!userAgent) return "Unknown Browser";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown Browser";
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingSessionId(sessionId);
    try {
      await authClient.revokeSession({ token: sessionId });
      toast.success("Session revoked");
      fetchSessions();
    } catch (error) {
      toast.error("Failed to revoke session");
    } finally {
      setRevokingSessionId(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      await authClient.revokeOtherSessions();
      toast.success("All other sessions revoked");
      fetchSessions();
    } catch (error) {
      toast.error("Failed to revoke all sessions");
    } finally {
      setShowRevokeAllDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Active Sessions
        </CardTitle>
        <CardDescription>
          Manage your active sessions across different devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No active sessions found
          </p>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {sessions.length} active session
                {sessions.length !== 1 ? "s" : ""}
              </p>
              {sessions.length > 1 && (
                <AlertDialog
                  open={showRevokeAllDialog}
                  onOpenChange={setShowRevokeAllDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Revoke All Other Sessions
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Revoke All Other Sessions
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will sign you out of all other devices and
                        sessions. You will remain signed in on this device.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleRevokeAllSessions}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Revoke All Sessions
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {getDeviceIcon(session.userAgent)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {getDeviceType(session.userAgent)}
                        </p>
                        {session.isCurrent && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            Current Session
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{getBrowserName(session.userAgent)}</span>
                        {session.ipAddress && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{session.ipAddress}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last active:{" "}
                        {new Date(session.createdAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expires: {new Date(session.expiresAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!session.isCurrent && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={revokingSessionId === session.id}
                          >
                            {revokingSessionId === session.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke Session</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to revoke this session? The
                              device will be signed out immediately.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRevokeSession(session.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Revoke Session
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
