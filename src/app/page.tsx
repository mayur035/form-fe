"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface FormData {
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

const Main = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [submissions, setSubmissions] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const validatePhoneNumber = (phone: string): string => {
    // Remove any non-digit characters for validation
    const digits = phone.replace(/\D/g, "");

    if (!digits) {
      return "Phone number is required";
    }

    // Check for exactly 10 digits
    if (digits.length !== 10) {
      return "Phone number must be 10 digits";
    }

    // Check if starts with valid Indian mobile prefixes (6, 7, 8, or 9)
    if (!["6", "7", "8", "9"].includes(digits[0])) {
      return "Invalid Indian mobile number. Must start with 6, 7, 8, or 9";
    }

    return "";
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get`);
      const data = await response.json();
      setSubmissions(data.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch data");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, ""); // Strip non-digit characters
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));

      if (digitsOnly) {
        setPhoneError(validatePhoneNumber(digitsOnly));
      } else {
        setPhoneError("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate phone before submission
    const phoneValidationError = validatePhoneNumber(formData.phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    setError("");
    setPhoneError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setFormData({
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        email: "",
      });

      await fetchData();
    } catch (err) {
      console.log(err);
      setError("Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={10} // Limit input to 10 characters
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${phoneError && formData.phone ? "border-red-500" : ""
                    }`}
                />
                {phoneError && formData.phone && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || !!phoneError}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Address</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 &&
                  submissions.map((submission, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        {submission.first_name} {submission.last_name}
                      </td>
                      <td className="p-2">{submission.address}</td>
                      <td className="p-2">{submission.phone}</td>
                      <td className="p-2">{submission.email}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Main;
