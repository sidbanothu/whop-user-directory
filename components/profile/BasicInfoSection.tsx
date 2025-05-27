import { useFormContext } from "react-hook-form";

export function BasicInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
      {/* TODO: Add form fields for username, name, bio, avatar */}
      <div className="space-y-4">
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message as string}</p>
          )}
        </div>
        <div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
          )}
        </div>
        <div>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Bio"
            {...register("bio")}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio.message as string}</p>
          )}
        </div>
        {/* Avatar upload will go here */}
      </div>
    </section>
  );
} 