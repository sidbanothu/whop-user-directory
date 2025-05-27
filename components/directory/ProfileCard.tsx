import Image from "next/image";
import { Profile } from "@/lib/types/profile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        <p className="mb-4 text-sm">{profile.bio}</p>
        <div className="flex flex-wrap gap-2">
          {profile.sections.map((section) => (
            <Badge key={section.type} variant="secondary">
              {section.title}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 