import Image from "next/image";
import { Profile } from "@/lib/types/profile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OPTIONAL_SECTIONS } from "@/components/profile/optionalSectionsConfig";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative h-32 bg-muted">
        {profile.avatarUrl && (
          <div className="absolute -bottom-12 left-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-14">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">{profile.name}</h3>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
        {profile.bio && (
          <p className="mb-4 text-sm text-muted-foreground">{profile.bio}</p>
        )}
        {profile.sections.length > 0 && (
          <div className="space-y-4">
            {profile.sections.map((section) => {
              const sectionConfig = OPTIONAL_SECTIONS.find(s => s.key === section.type);
              const Icon = sectionConfig?.icon;
              return (
                <div key={section.type} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {Icon && (
                      <span className={sectionConfig?.iconColor}>
                        <Icon className="h-4 w-4" />
                      </span>
                    )}
                    <span>{section.title}</span>
                  </div>
                  <div className="space-y-2 pl-6">
                    {Object.entries(section.data).map(([key, value]) => {
                      if (Array.isArray(value)) {
                        return (
                          <div key={key} className="flex flex-wrap gap-1">
                            {value.map((item, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        );
                      }
                      if (typeof value === "object" && value !== null) {
                        return (
                          <div key={key} className="space-y-1">
                            {Object.entries(value as Record<string, string>).map(([k, v]) => (
                              <div key={k} className="text-xs">
                                <span className="font-medium">{k}:</span>{" "}
                                <span className="text-muted-foreground">{v}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="text-xs">
                          <span className="font-medium">{key}:</span>{" "}
                          <span className="text-muted-foreground">{value as string}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 