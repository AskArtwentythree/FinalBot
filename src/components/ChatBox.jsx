import Message from "./Message";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";


const ChatBox = () => {
  const messagesEndRef = useRef();
  const [messages, setMassages] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  };

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
    );

    const q2 = query(
      collection(db, "history"),
      orderBy("createdAt"),
    )

    const dbq = query(
      collection(db, "history")
    );



    const unsubscribe1 = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMassages(messages)
    });
    // const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
    //   querySnapshot.docChanges().forEach((change) => {
    //     if (change.type === 'added') {
    //       console.log('New message: ', change.doc.data());
    //       let msg = change.doc.data();
    //       msg.text = msg["An answer"]
    //       setMassages(messages => [...messages, msg]);
    //     }
    //   });
    // });

    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMassages(messages)
    });

    let unsubscribe = () => {

      unsubscribe1();
      unsubscribe2();
    }

    return () => unsubscribe();

  }, []);


  return (
    <div className="pb-44 pt-20 containerWrap">
      {messages.filter(el => el.createdAt != null).sort((a, b) => a.createdAt.seconds + a.createdAt.nanoseconds / 1000000000 - b.createdAt.seconds - b.createdAt.nanoseconds / 1000000000).map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChatBox;
