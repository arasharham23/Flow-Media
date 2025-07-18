import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

const EventUpdate = ({ refetch, event, setEventModal }) => {
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      category: event?.category,
      matchTime: event?.matchTime,
      matchDate: event?.matchDate,
      teamB: event?.teamB,
      team1Image: event?.team1Image,
      team2Image: event?.team2Image,
      matchUrl: event?.matchUrl,
      teamA: event?.teamA,
    },
  });

  const handleUpdateEvent = async (data) => {
    try {
      // Convert matchDate and matchTime to local datetime string (no "Z")
      if (data.matchDate && data.matchTime) {
        // Create a local Date object (do NOT add "Z")
        const localDate = new Date(`${data.matchDate}T${data.matchTime}:00`);

        // Format as "YYYY-MM-DDTHH:mm:ss" (no timezone info)
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, "0");
        const day = String(localDate.getDate()).padStart(2, "0");
        const hours = String(localDate.getHours()).padStart(2, "0");
        const minutes = String(localDate.getMinutes()).padStart(2, "0");
        const seconds = String(localDate.getSeconds()).padStart(2, "0");

        data.targetDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`; // No "Z"
      }

      // Send the updated data to the server
      const res = await axiosSecure.patch(`/api/update/${event?._id}`, data);

      // Handle UI response
      setEventModal(false);
      toast.success(res?.data?.message);
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center h-screen px-4">
      <div className="bg-[var(--secondary)] rounded-lg p-8 shadow-lg max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 bg-gray-100 transition-colors"
          onClick={() => setEventModal(false)}
        >
          <IoClose className="text-red-500 hover:text-red-700 text-2xl" />
        </button>

        <h2 className="text-center text-xl font-bold mb-6 text-[var(--text)]">
          Update {event?.category} Event
        </h2>

        <form
          onSubmit={handleSubmit(handleUpdateEvent)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Category */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-[var(--text)]">
              Category
            </label>
            <input
              type="text"
              {...register("category")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
              disabled
            />
          </div>

          {/* Match Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="matchDate" className="text-[var(--text)]">
              Match Date
            </label>
            <input
              type="date"
              {...register("matchDate")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* Match Time */}
          <div className="flex flex-col gap-2">
            <label htmlFor="matchTime" className="text-[var(--text)]">
              Match Time
            </label>
            <input
              type="time"
              {...register("matchTime")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* eventName */}
          <div className="flex flex-col gap-2">
            <label htmlFor="teamA" className="text-[var(--text)]">
              Event Name
            </label>
            <input
              type="text"
              {...register("eventName")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* Team A */}
          <div className="flex flex-col gap-2">
            <label htmlFor="teamA" className="text-[var(--text)]">
              Team A
            </label>
            <input
              type="text"
              {...register("teamA")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* Team B */}
          <div className="flex flex-col gap-2">
            <label htmlFor="teamB" className="text-[var(--text)]">
              Team B
            </label>
            <input
              type="text"
              {...register("teamB")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* Team A Image URL */}
          <div className="flex flex-col gap-2">
            <label htmlFor="team1Image" className="text-[var(--text)]">
              Team A Image URL
            </label>
            <input
              type="url"
              {...register("team1Image")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* Team B Image URL */}
          <div className="flex flex-col gap-2">
            <label htmlFor="team2Image" className="text-[var(--text)]">
              Team B Image URL
            </label>
            <input
              type="url"
              {...register("team2Image")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* Match Stream URL */}
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label htmlFor="matchUrl" className="text-[var(--text)]">
              Match Stream URL
            </label>
            <input
              type="url"
              {...register("matchUrl")}
              className="w-full py-3 px-4 rounded-md border border-gray-300 focus:outline-none text-[var(--text)] focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)] "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="primary-btn w-full col-span-1 lg:col-span-2 mt-4"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventUpdate;
