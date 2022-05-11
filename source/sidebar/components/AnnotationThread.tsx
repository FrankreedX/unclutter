import React from "react";
import { LindyAnnotation } from "../../common/annotations/create";
import Annotation from "./Annotation";
import AnnotationDraft from "./AnnotationDraft";

function AnnotationThread(props) {
    const replyLevel = props.replyLevel || 0;

    const Component = props.annotation.isMyAnnotation
        ? AnnotationDraft
        : Annotation;

    return (
        <div className="">
            <Component
                {...props}
                deleteHideAnnotation={() =>
                    props.deleteHideAnnotation(props.annotation, null)
                }
                createReply={() =>
                    props.createReply(props.annotation, props.annotation)
                }
                showReplyCount={replyLevel >= 2}
                isReply={replyLevel !== 0}
            />
            {replyLevel < 2 && (
                <div className="ml-5">
                    {props.annotation.replies?.map((reply) => (
                        <AnnotationThread
                            key={reply.id}
                            {...props}
                            annotation={reply}
                            className="mt-1 rounded border-l-0"
                            replyLevel={replyLevel + 1}
                            deleteHideAnnotation={
                                replyLevel === 0
                                    ? (nestedAnnotation: LindyAnnotation) =>
                                          props.deleteHideAnnotation(
                                              nestedAnnotation,
                                              props.annotation
                                          )
                                    : props.deleteHideAnnotation
                            }
                            createReply={
                                replyLevel === 0
                                    ? (nestedAnnotation: LindyAnnotation) =>
                                          props.createReply(
                                              nestedAnnotation,
                                              props.annotation
                                          )
                                    : props.createReply
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
export default AnnotationThread;
