import { useFormContext } from "react-hook-form";

export function BasicInfoSection({ username }: { username: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section className="mb-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="username" className="block font-semibold mb-1 text-gray-700">Username</label>
          <input
            id="username"
            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed opacity-60 text-gray-500"
            placeholder="Username"
            value={username}
            readOnly
            disabled
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="name" className="block font-semibold mb-1 text-gray-700">Display Name</label>
          <input
            id="name"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Display Name"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Min 2 characters" },
              maxLength: { value: 64, message: "Max 64 characters" },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
          )}
        </div>
        <div>
          <label htmlFor="bio" className="block font-semibold mb-1 text-gray-700">Bio</label>
          <textarea
            id="bio"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="Bio"
            {...register("bio", {
              maxLength: { value: 256, message: "Max 256 characters" },
            })}
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